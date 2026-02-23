package com.project.TeamFinder.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.dto.organizer.BulkImportResultDTO;
import com.project.TeamFinder.dto.organizer.EventMetricsDTO;
import com.project.TeamFinder.dto.organizer.NotificationCampaignRequestDTO;
import com.project.TeamFinder.dto.organizer.NotificationCampaignResultDTO;
import com.project.TeamFinder.dto.organizer.SplitTeamRequestDTO;
import com.project.TeamFinder.dto.organizer.SuggestedMatchDTO;
import com.project.TeamFinder.dto.organizer.TeamJoinRequestDTO;
import com.project.TeamFinder.dto.organizer.TeamOpenSpotDTO;
import com.project.TeamFinder.dto.organizer.UpdateTeamOrganizerRequestDTO;
import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.model.EventUser;
import com.project.TeamFinder.model.Message;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.model.TeamMembers;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.EventRepository;
import com.project.TeamFinder.repository.EventUserRepository;
import com.project.TeamFinder.repository.MessageRepository;
import com.project.TeamFinder.repository.TeamMembersRepository;
import com.project.TeamFinder.repository.TeamRepository;
import com.project.TeamFinder.repository.UserInterestedInTeamRepository;
import com.project.TeamFinder.repository.UserRepository;

@Service
public class OrganizerService {
    private final EventRepository eventRepository;
    private final EventUserRepository eventUserRepository;
    private final TeamRepository teamRepository;
    private final TeamMembersRepository teamMembersRepository;
    private final UserInterestedInTeamRepository userInterestedInTeamRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final TeamService teamService;
    private final EmailService emailService;

    public OrganizerService(
            EventRepository eventRepository,
            EventUserRepository eventUserRepository,
            TeamRepository teamRepository,
            TeamMembersRepository teamMembersRepository,
            UserInterestedInTeamRepository userInterestedInTeamRepository,
            UserRepository userRepository,
            MessageRepository messageRepository,
            TeamService teamService,
            EmailService emailService) {
        this.eventRepository = eventRepository;
        this.eventUserRepository = eventUserRepository;
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.userInterestedInTeamRepository = userInterestedInTeamRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.teamService = teamService;
        this.emailService = emailService;
    }

    public EventMetricsDTO getEventMetrics(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        int targetTeamSize = normalizeEventTeamSize(event.getTeamSize());

        List<EventUser> interestedRows = eventUserRepository.findByEventId(eventId);
        Set<Long> interestedUserIds = interestedRows.stream()
                .map(EventUser::getUserId)
                .collect(Collectors.toSet());

        List<Team> teams = teamRepository.findByEventId(eventId);
        List<Long> teamIds = teams.stream().map(Team::getId).collect(Collectors.toList());

        List<TeamMembers> memberships = teamIds.isEmpty()
                ? List.of()
                : teamMembersRepository.findByTeamIdIn(teamIds);

        Map<Long, Integer> memberCountByTeam = new HashMap<>();
        Set<Long> teamMemberUserIds = new HashSet<>();
        for (TeamMembers membership : memberships) {
            memberCountByTeam.merge(membership.getTeamId(), 1, Integer::sum);
            teamMemberUserIds.add(membership.getUserId());
        }

        Set<Long> matchedInterestedUsers = interestedUserIds.stream()
                .filter(teamMemberUserIds::contains)
                .collect(Collectors.toSet());

        long matchedParticipants = matchedInterestedUsers.size();
        long unmatchedParticipants = interestedUserIds.size() - matchedParticipants;
        long dropOffCount = unmatchedParticipants;
        double dropOffRate = interestedUserIds.isEmpty()
                ? 0.0
                : (double) dropOffCount / interestedUserIds.size();

        List<TeamOpenSpotDTO> openSpotsByTeam = teams.stream()
                .map(team -> {
                    int memberCount = memberCountByTeam.getOrDefault(team.getId(), 0);
                    int openSpots = Math.max(0, targetTeamSize - memberCount);
                    return new TeamOpenSpotDTO(team.getId(), team.getName(), memberCount, openSpots);
                })
                .collect(Collectors.toList());

        EventMetricsDTO dto = new EventMetricsDTO();
        dto.setEventId(event.getId());
        dto.setMatchedParticipants(matchedParticipants);
        dto.setMatchesMade(matchedParticipants);
        dto.setUnmatchedParticipants(unmatchedParticipants);
        dto.setDropOffCount(dropOffCount);
        dto.setDropOffRate(dropOffRate);
        dto.setOpenSpotsByTeam(openSpotsByTeam);
        dto.setAverageTimeToMatchHours(estimateTimeToMatchHours(matchedInterestedUsers));
        dto.setTimeToMatchNote("Estimated from earliest chat activity. Interest-to-team timestamp tracking is not yet instrumented.");
        return dto;
    }

    private Double estimateTimeToMatchHours(Set<Long> matchedInterestedUsers) {
        if (matchedInterestedUsers.isEmpty()) {
            return null;
        }

        Instant now = Instant.now();
        Map<Long, Instant> earliestMessageByUser = new HashMap<>();
        Iterable<Message> allMessages = messageRepository.findAll();
        for (Message message : allMessages) {
            if (message.getSenderId() == null || message.getTimestamp() == null) {
                continue;
            }
            Long senderId = message.getSenderId();
            if (!matchedInterestedUsers.contains(senderId)) {
                continue;
            }
            Instant previous = earliestMessageByUser.get(senderId);
            if (previous == null || message.getTimestamp().isBefore(previous)) {
                earliestMessageByUser.put(senderId, message.getTimestamp());
            }
        }

        if (earliestMessageByUser.isEmpty()) {
            return null;
        }

        double totalHours = 0.0;
        int count = 0;
        for (Instant timestamp : earliestMessageByUser.values()) {
            long seconds = Math.max(0, now.getEpochSecond() - timestamp.getEpochSecond());
            totalHours += (seconds / 3600.0);
            count++;
        }

        return count == 0 ? null : totalHours / count;
    }

    @Transactional
    public BulkImportResultDTO importParticipants(Long eventId, MultipartFile file) throws IOException {
        eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        BulkImportResultDTO result = new BulkImportResultDTO();

        Set<Long> alreadyInterested = new HashSet<>(eventUserRepository.findUserIdsOfAlreadyInterestedUsers(eventId));
        List<String> lines = readCsvLines(file);
        if (lines.isEmpty()) {
            return result;
        }

        int startIndex = hasHeader(lines.get(0)) ? 1 : 0;
        int processed = 0;
        int added = 0;
        int skipped = 0;

        for (int i = startIndex; i < lines.size(); i++) {
            processed++;
            String[] columns = splitCsvLine(lines.get(i));
            if (columns.length == 0 || columns[0].isBlank()) {
                skipped++;
                result.addError("Row " + (i + 1) + ": missing email");
                continue;
            }
            String email = columns[0].trim().toLowerCase(Locale.ROOT);
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                skipped++;
                result.addError("Row " + (i + 1) + ": user not found for email " + email);
                continue;
            }

            Long userId = userOptional.get().getId();
            if (alreadyInterested.contains(userId)) {
                continue;
            }

            eventUserRepository.addInterestedUserToEvent(eventId, userId);
            alreadyInterested.add(userId);
            added++;
        }

        result.setProcessedRows(processed);
        result.setAddedParticipants(added);
        result.setSkippedRows(skipped);
        return result;
    }

    @Transactional
    public BulkImportResultDTO importTeams(Long eventId, MultipartFile file) throws IOException {
        eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        BulkImportResultDTO result = new BulkImportResultDTO();
        List<String> lines = readCsvLines(file);
        if (lines.isEmpty()) {
            return result;
        }

        int startIndex = hasHeader(lines.get(0)) ? 1 : 0;
        int processed = 0;
        int skipped = 0;
        int teamsCreated = 0;
        int membershipsAdded = 0;

        for (int i = startIndex; i < lines.size(); i++) {
            processed++;
            String[] columns = splitCsvLine(lines.get(i));
            if (columns.length < 2) {
                skipped++;
                result.addError("Row " + (i + 1) + ": expected team_name,member_emails");
                continue;
            }

            String teamName = columns[0].trim();
            String memberEmailsValue = columns[1].trim();
            String rolesLookingForValue = columns.length > 2 ? columns[2].trim() : "";
            if (teamName.isBlank()) {
                skipped++;
                result.addError("Row " + (i + 1) + ": missing team name");
                continue;
            }

            List<String> memberEmails = List.of(memberEmailsValue.split("[;|]")).stream()
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .map(email -> email.toLowerCase(Locale.ROOT))
                    .toList();

            Team team = new Team();
            team.setName(teamName);
            team.setEventId(eventId);
            team.setRolesLookingFor(normalizeRolesCsv(rolesLookingForValue));
            Team savedTeam = teamRepository.save(team);
            teamsCreated++;

            Set<Long> uniqueMemberIds = new LinkedHashSet<>();
            for (String email : memberEmails) {
                Optional<User> userOptional = userRepository.findByEmail(email);
                if (userOptional.isEmpty()) {
                    result.addError("Row " + (i + 1) + ": user not found for email " + email);
                    continue;
                }
                uniqueMemberIds.add(userOptional.get().getId());
            }

            for (Long userId : uniqueMemberIds) {
                if (!teamMembersRepository.existsByTeamIdAndUserId(savedTeam.getId(), userId)) {
                    teamMembersRepository.addUserToTeam(savedTeam.getId(), userId);
                    membershipsAdded++;
                }
            }
        }

        result.setProcessedRows(processed);
        result.setCreatedTeams(teamsCreated);
        result.setAddedMemberships(membershipsAdded);
        result.setSkippedRows(skipped);
        return result;
    }

    public List<TeamJoinRequestDTO> getJoinRequests(Long eventId) {
        List<Team> teams = teamRepository.findByEventId(eventId);
        if (teams.isEmpty()) {
            return List.of();
        }

        Map<Long, Team> teamById = teams.stream()
                .collect(Collectors.toMap(Team::getId, team -> team));

        List<Long> teamIds = teams.stream().map(Team::getId).toList();
        List<Object[]> requests = userInterestedInTeamRepository.findRequestsByTeamIds(teamIds);
        if (requests.isEmpty()) {
            return List.of();
        }

        Set<Long> userIds = new HashSet<>();
        for (Object[] row : requests) {
            userIds.add(((Number) row[1]).longValue());
        }

        List<UserProjection> users = userRepository.findAllByIdIn(new ArrayList<>(userIds));
        Map<Long, UserProjection> usersById = users.stream()
                .collect(Collectors.toMap(UserProjection::getId, user -> user));

        List<TeamJoinRequestDTO> result = new ArrayList<>();
        for (Object[] row : requests) {
            Long teamId = ((Number) row[0]).longValue();
            Long userId = ((Number) row[1]).longValue();
            Team team = teamById.get(teamId);
            UserProjection user = usersById.get(userId);
            if (team == null || user == null) {
                continue;
            }
            result.add(new TeamJoinRequestDTO(
                    teamId,
                    team.getName(),
                    userId,
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName()));
        }
        return result;
    }

    @Transactional
    public void approveJoinRequest(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        if (!teamMembersRepository.existsByTeamIdAndUserId(teamId, userId)) {
            teamMembersRepository.addUserToTeam(teamId, userId);
        }
        userInterestedInTeamRepository.removeUserInterestedInTeam(teamId, userId);
    }

    @Transactional
    public void rejectJoinRequest(Long teamId, Long userId) {
        teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        userInterestedInTeamRepository.removeUserInterestedInTeam(teamId, userId);
    }

    @Transactional
    public TeamWithMembersDTO updateTeam(Long teamId, UpdateTeamOrganizerRequestDTO request) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        if (request.getTeamName() != null && !request.getTeamName().isBlank()) {
            team.setName(request.getTeamName().trim());
        }
        if (request.getRolesLookingFor() != null) {
            team.setRolesLookingFor(teamService.joinRoles(request.getRolesLookingFor()));
        }
        teamRepository.save(team);

        List<Long> userIds = request.getUserIds();
        if (userIds != null) {
            List<Long> uniqueUserIds = userIds.stream()
                    .filter(id -> id != null && id > 0)
                    .distinct()
                    .toList();
            teamMembersRepository.deleteMembers(teamId);
            for (Long userId : uniqueUserIds) {
                teamMembersRepository.addUserToTeam(teamId, userId);
            }
        }

        return teamService.getTeam(teamId);
    }

    @Transactional
    public void mergeTeams(Long fromTeamId, Long toTeamId) {
        if (fromTeamId.equals(toTeamId)) {
            throw new RuntimeException("Cannot merge a team into itself");
        }

        Team fromTeam = teamRepository.findById(fromTeamId).orElseThrow(() -> new RuntimeException("Source team not found"));
        Team toTeam = teamRepository.findById(toTeamId).orElseThrow(() -> new RuntimeException("Target team not found"));
        if (fromTeam.getEventId() != toTeam.getEventId()) {
            throw new RuntimeException("Teams belong to different events");
        }

        List<TeamMembers> fromMembers = teamMembersRepository.findByTeamId(fromTeamId);
        Set<Long> toMemberIds = teamMembersRepository.findByTeamId(toTeamId).stream()
                .map(TeamMembers::getUserId)
                .collect(Collectors.toSet());

        for (TeamMembers member : fromMembers) {
            if (!toMemberIds.contains(member.getUserId())) {
                teamMembersRepository.addUserToTeam(toTeamId, member.getUserId());
            }
        }

        userInterestedInTeamRepository.moveRequestsToAnotherTeam(fromTeamId, toTeamId);
        teamMembersRepository.deleteMembers(fromTeamId);
        teamRepository.deleteById(fromTeamId);
    }

    @Transactional
    public TeamWithMembersDTO splitTeam(Long teamId, SplitTeamRequestDTO request) {
        Team sourceTeam = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        if (request.getNewTeamName() == null || request.getNewTeamName().isBlank()) {
            throw new RuntimeException("New team name is required");
        }
        if (request.getUserIdsToMove() == null || request.getUserIdsToMove().isEmpty()) {
            throw new RuntimeException("At least one user must be moved");
        }

        Set<Long> moveUserIds = new HashSet<>(request.getUserIdsToMove());
        List<TeamMembers> sourceMembers = teamMembersRepository.findByTeamId(teamId);
        Set<Long> sourceMemberIds = sourceMembers.stream().map(TeamMembers::getUserId).collect(Collectors.toSet());

        for (Long userId : moveUserIds) {
            if (!sourceMemberIds.contains(userId)) {
                throw new RuntimeException("User " + userId + " is not in the source team");
            }
        }

        Team newTeam = new Team();
        newTeam.setName(request.getNewTeamName().trim());
        newTeam.setEventId(sourceTeam.getEventId());
        newTeam.setRolesLookingFor(sourceTeam.getRolesLookingFor());
        Team savedTeam = teamRepository.save(newTeam);

        for (Long userId : moveUserIds) {
            teamMembersRepository.deleteMember(teamId, userId);
            if (!teamMembersRepository.existsByTeamIdAndUserId(savedTeam.getId(), userId)) {
                teamMembersRepository.addUserToTeam(savedTeam.getId(), userId);
            }
        }

        return teamService.getTeam(savedTeam.getId());
    }

    public String exportFinalTeamSheet(Long eventId) {
        List<Team> teams = teamRepository.findByEventId(eventId);
        List<TeamWithMembersDTO> teamsWithMembers = teamService.getTeamsWithMembers(teams);

        StringBuilder csv = new StringBuilder();
        csv.append("team_id,team_name,user_id,first_name,last_name,email\n");
        for (TeamWithMembersDTO team : teamsWithMembers) {
            if (team.getMembers() == null || team.getMembers().isEmpty()) {
                csv.append(team.getTeamId()).append(",")
                        .append(escapeCsv(team.getTeamName())).append(",,,,\n");
                continue;
            }
            for (UserProjection member : team.getMembers()) {
                csv.append(team.getTeamId()).append(",")
                        .append(escapeCsv(team.getTeamName())).append(",")
                        .append(member.getId()).append(",")
                        .append(escapeCsv(member.getFirstName())).append(",")
                        .append(escapeCsv(member.getLastName())).append(",")
                        .append(escapeCsv(member.getEmail())).append("\n");
            }
        }
        return csv.toString();
    }

    public List<SuggestedMatchDTO> getSuggestedMatches(Long eventId, Integer limitParam) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        int eventTeamSize = normalizeEventTeamSize(event.getTeamSize());
        int limit = limitParam == null || limitParam < 1 ? 20 : Math.min(limitParam, 200);

        Set<Long> interestedUserIds = eventUserRepository.findByEventId(eventId).stream()
                .map(EventUser::getUserId)
                .collect(Collectors.toSet());
        if (interestedUserIds.isEmpty()) {
            return List.of();
        }

        List<Team> teams = teamRepository.findByEventId(eventId);
        if (teams.isEmpty()) {
            return List.of();
        }

        List<Long> teamIds = teams.stream().map(Team::getId).toList();
        List<TeamMembers> memberships = teamMembersRepository.findByTeamIdIn(teamIds);
        Set<Long> matchedUserIds = memberships.stream().map(TeamMembers::getUserId).collect(Collectors.toSet());
        List<Long> unmatchedUserIds = interestedUserIds.stream()
                .filter(userId -> !matchedUserIds.contains(userId))
                .toList();
        if (unmatchedUserIds.isEmpty()) {
            return List.of();
        }

        List<User> unmatchedUsers = userRepository.findAllById(unmatchedUserIds);
        Map<Long, Integer> memberCountByTeamId = new HashMap<>();
        for (TeamMembers membership : memberships) {
            memberCountByTeamId.merge(membership.getTeamId(), 1, Integer::sum);
        }

        List<SuggestedMatchDTO> scoredMatches = new ArrayList<>();
        for (Team team : teams) {
            int memberCount = memberCountByTeamId.getOrDefault(team.getId(), 0);
            int openSlots = Math.max(0, eventTeamSize - memberCount);
            if (openSlots < 1) {
                continue;
            }

            List<String> neededRoles = splitRoles(team.getRolesLookingFor());
            Set<String> neededRoleSet = toLowerSet(neededRoles);

            for (User user : unmatchedUsers) {
                MatchScore score = scoreUserForTeam(user, neededRoleSet, openSlots);
                if (score.score() <= 0) {
                    continue;
                }

                SuggestedMatchDTO dto = new SuggestedMatchDTO();
                dto.setUserId(user.getId());
                dto.setUserEmail(user.getEmail());
                dto.setUserName((user.getFirstName() + " " + user.getLastName()).trim());
                dto.setUserPreferredRole(user.getPreferredRole());
                dto.setUserSkills(user.getSkills() == null ? List.of() : user.getSkills());
                dto.setTeamId(team.getId());
                dto.setTeamName(team.getName());
                dto.setTeamOpenSlots(openSlots);
                dto.setTeamRolesLookingFor(neededRoles);
                dto.setScore(score.score());
                dto.setReasons(score.reasons());
                scoredMatches.add(dto);
            }
        }

        return scoredMatches.stream()
                .sorted(Comparator
                        .comparingInt(SuggestedMatchDTO::getScore).reversed()
                        .thenComparing(SuggestedMatchDTO::getTeamId)
                        .thenComparing(SuggestedMatchDTO::getUserId))
                .limit(limit)
                .toList();
    }

    public NotificationCampaignResultDTO sendNudgesToUnmatchedUsers(Long eventId, NotificationCampaignRequestDTO request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        String subject = request != null && request.getSubject() != null && !request.getSubject().isBlank()
                ? request.getSubject().trim()
                : "TeamFinder: You're still unmatched for " + event.getName();
        String body = request != null && request.getMessage() != null && !request.getMessage().isBlank()
                ? request.getMessage().trim()
                : "You still have time to join a team. Explore open teams and connect with people now.";
        return sendCampaignToUnmatchedUsers(eventId, subject, body);
    }

    public NotificationCampaignResultDTO sendDeadlineReminders(Long eventId, NotificationCampaignRequestDTO request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        int daysBeforeDeadline = request != null && request.getDaysBeforeDeadline() != null
                ? Math.max(0, request.getDaysBeforeDeadline())
                : 3;

        long nowMillis = System.currentTimeMillis();
        long deadlineMillis = event.getEnd_date() == null ? 0L : event.getEnd_date().getTime();
        long thresholdMillis = nowMillis + (daysBeforeDeadline * 24L * 60L * 60L * 1000L);
        NotificationCampaignResultDTO result = new NotificationCampaignResultDTO();
        if (deadlineMillis == 0L || deadlineMillis > thresholdMillis) {
            return result;
        }

        String subject = request != null && request.getSubject() != null && !request.getSubject().isBlank()
                ? request.getSubject().trim()
                : "TeamFinder: Deadline approaching for " + event.getName();
        String body = request != null && request.getMessage() != null && !request.getMessage().isBlank()
                ? request.getMessage().trim()
                : "Reminder: this event is closing soon. Join a team before the deadline.";
        return sendCampaignToUnmatchedUsers(eventId, subject, body);
    }

    private NotificationCampaignResultDTO sendCampaignToUnmatchedUsers(Long eventId, String subject, String message) {
        List<User> recipients = getUnmatchedUsersForEvent(eventId);
        NotificationCampaignResultDTO result = new NotificationCampaignResultDTO();
        result.setRecipients(recipients.size());

        int sent = 0;
        for (User user : recipients) {
            try {
                emailService.sendVerificationEmail(
                        user.getEmail(),
                        subject,
                        "<p>" + escapeHtml(message) + "</p>");
                sent++;
            } catch (Exception e) {
                result.addError("Failed for " + user.getEmail() + ": " + e.getMessage());
            }
        }
        result.setSent(sent);
        return result;
    }

    private List<User> getUnmatchedUsersForEvent(Long eventId) {
        Set<Long> interestedUserIds = eventUserRepository.findByEventId(eventId).stream()
                .map(EventUser::getUserId)
                .collect(Collectors.toSet());
        if (interestedUserIds.isEmpty()) {
            return List.of();
        }

        List<Team> teams = teamRepository.findByEventId(eventId);
        List<Long> teamIds = teams.stream().map(Team::getId).toList();
        Set<Long> matchedUserIds = teamIds.isEmpty()
                ? Set.of()
                : teamMembersRepository.findByTeamIdIn(teamIds).stream()
                        .map(TeamMembers::getUserId)
                        .collect(Collectors.toSet());

        List<Long> unmatchedUserIds = interestedUserIds.stream()
                .filter(userId -> !matchedUserIds.contains(userId))
                .toList();
        if (unmatchedUserIds.isEmpty()) {
            return List.of();
        }
        return userRepository.findAllById(unmatchedUserIds);
    }

    private record MatchScore(int score, List<String> reasons) {
    }

    private MatchScore scoreUserForTeam(User user, Set<String> neededRoles, int openSlots) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        Set<String> userSkills = toLowerSet(user.getSkills());
        long skillMatches = userSkills.stream().filter(neededRoles::contains).count();
        if (skillMatches > 0) {
            score += (int) skillMatches * 10;
            reasons.add("skill overlap: " + skillMatches);
        }

        String preferredRole = normalize(user.getPreferredRole());
        if (!preferredRole.isBlank() && neededRoles.contains(preferredRole)) {
            score += 20;
            reasons.add("preferred role match");
        }

        score += Math.min(openSlots, 3) * 2;
        reasons.add("open slots: " + openSlots);

        return new MatchScore(score, reasons);
    }

    private Set<String> toLowerSet(List<String> values) {
        if (values == null || values.isEmpty()) {
            return Set.of();
        }
        return values.stream()
                .filter(Objects::nonNull)
                .map(this::normalize)
                .filter(value -> !value.isBlank())
                .collect(Collectors.toSet());
    }

    private Set<String> toLowerSet(Set<String> values) {
        if (values == null || values.isEmpty()) {
            return Set.of();
        }
        return values.stream()
                .map(this::normalize)
                .filter(value -> !value.isBlank())
                .collect(Collectors.toSet());
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private List<String> splitRoles(String rolesCsv) {
        if (rolesCsv == null || rolesCsv.isBlank()) {
            return List.of();
        }
        return List.of(rolesCsv.split(",")).stream()
                .map(String::trim)
                .filter(role -> !role.isBlank())
                .toList();
    }

    private String normalizeRolesCsv(String rolesValue) {
        if (rolesValue == null || rolesValue.isBlank()) {
            return "";
        }
        return List.of(rolesValue.split("[;|,]")).stream()
                .map(this::normalize)
                .filter(role -> !role.isBlank())
                .distinct()
                .collect(Collectors.joining(","));
    }

    private int normalizeEventTeamSize(Integer eventTeamSize) {
        return eventTeamSize == null || eventTeamSize < 1 ? 4 : eventTeamSize;
    }

    private String escapeHtml(String input) {
        if (input == null) {
            return "";
        }
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }

    private List<String> readCsvLines(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            return reader.lines()
                    .map(String::trim)
                    .filter(line -> !line.isBlank())
                    .collect(Collectors.toList());
        }
    }

    private boolean hasHeader(String line) {
        String lower = line.toLowerCase(Locale.ROOT);
        return lower.contains("email") || lower.contains("team_name") || lower.contains("team");
    }

    private String[] splitCsvLine(String line) {
        return line.split(",", -1);
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\"") || escaped.contains("\n")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }
}
