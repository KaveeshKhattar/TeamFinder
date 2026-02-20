package com.project.TeamFinder.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.CreateTeamRequestDTO;
import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.model.TeamMembers;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.EventUserRepository;
import com.project.TeamFinder.repository.TeamMembersRepository;
import com.project.TeamFinder.repository.TeamRepository;
import com.project.TeamFinder.repository.UserInterestedInTeamRepository;
import com.project.TeamFinder.repository.UserRepository;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMembersRepository teamMembersRepository;
    private final UserInterestedInTeamRepository userInterestedInTeamRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository,
            UserRepository userRepository, EventUserRepository eventUserRepositroy,
            UserInterestedInTeamRepository userInterestedInTeamRepository) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.userRepository = userRepository;
        this.userInterestedInTeamRepository = userInterestedInTeamRepository;
    }

    public List<Team> getTeamsByEventId(Long eventId) {
        return teamRepository.findByEventId(eventId);
    }

    public List<TeamWithMembersDTO> searchTeams(List<TeamWithMembersDTO> globalTeams, String name) {
        return globalTeams.stream()
                .filter(team -> team.getTeamName() != null
                        && team.getTeamName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    public void addTeam(CreateTeamRequestDTO team) {

        Team newTeam = new Team();

        newTeam.setName(team.getTeamName());
        newTeam.setEventId(team.getEventId());

        Team savedTeam = teamRepository.save(newTeam);
        Long teamId = savedTeam.getId();

        if (team.getUserIds() != null && !team.getUserIds().isEmpty()) {
            for (Long userId : team.getUserIds()) {
                System.out.println("userId " + userId);
                teamMembersRepository.addUserToTeam(teamId, userId);

            }
        }

    }

    public void addUsersToTeam(Long teamId, List<Long> userIds) {
        for (Long userId : userIds) {
            teamMembersRepository.addUserToTeam(teamId, userId);
        }
    }

    public void updateTeam(Team updatedTeam) {
        teamRepository.save(updatedTeam); // This saves the updated team entity
    }

    public void updateTeamName(Long id, String name) {
        teamRepository.updateTeamNameById(id, name);
    }

    public void updateUsersInTeam(Long teamId, List<Long> userIds) {
        teamMembersRepository.deleteMembers(teamId);
        for (Long userId : userIds) {
            teamMembersRepository.addUserToTeam(teamId, userId);
        }
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    public void deleteTeamMembers(Long id) {
        teamMembersRepository.deleteMembers(id);
    }

    // public List<TeamWithMembersDTO> getAllTeams() {
    // List<Team> teams = (List<Team>) teamRepository.findAll();
    // List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();

    // for (Team team : teams) {

    // List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());

    // List<Long> userIds = members.stream()
    // .map(TeamMembers::getUserId)
    // .collect(Collectors.toList());

    // List<UserProjection> users = userRepository.findAllByIdIn(userIds);

    // TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
    // teamsWithMembers.add(teamWithMembersDTO);
    // }

    // return teamsWithMembers;
    // }

    public Team getTeamById(Long id) {
        Optional<Team> optionalTeam = teamRepository.findById(id);
        Team team = optionalTeam.orElseThrow(() -> new RuntimeException("Team not found"));

        return team;
    }

    public List<TeamWithMembersDTO> getAllTeamsWithMembers(Long eventId) {
        List<Team> teams = teamRepository.findByEventId(eventId);
        return buildTeamWithMembersDTOs(teams);
    }

    public TeamWithMembersDTO getTeam(Long teamId) {
        Optional<Team> team = teamRepository.findById(teamId);

        if (team.isEmpty()) {
            return null;
        }

        List<TeamWithMembersDTO> teamsWithMembers = buildTeamWithMembersDTOs(List.of(team.get()));
        if (teamsWithMembers.isEmpty()) {
            return null;
        }
        return teamsWithMembers.get(0);
    }

    public List<TeamWithMembersDTO> getTeamsWithMembers(List<Team> teams) {
        return buildTeamWithMembersDTOs(teams);
    }

    // public List<Long> getTeamIdsPerUserId(Long userId) {
    // return teamMembersRepository.findTeamIdByUserId(userId);
    // }

    // public List<TeamWithMembersDTO> getTeamsPerUserId(List<Long> teamIds) {

    // List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();
    // for (Long teamId : teamIds) {
    // Optional<Team> optionalTeam = teamRepository.findById(teamId);
    // Team team = optionalTeam.orElseThrow(() -> new RuntimeException("Team not
    // found"));
    // List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());
    // List<Long> userIds = members.stream()
    // .map(TeamMembers::getUserId) // Use method reference to get userId
    // .collect(Collectors.toList());

    // List<UserProjection> users = userRepository.findAllByIdIn(userIds);
    // TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
    // teamsWithMembers.add(teamWithMembersDTO);
    // }
    // return teamsWithMembers;

    // }

    public void toggleLead(Long teamId, Long userId) {
        if (userInterestedInTeamRepository.existsByUserIdAndTeamId(teamId, userId)) {
            userInterestedInTeamRepository.removeUserInterestedInTeam(teamId, userId);
        } else {
            userInterestedInTeamRepository.addUserInterestedInTeam(teamId, userId);
        }
    }

    public List<Long> getInterestedTeamsForEvent(Long userId) {
        List<Long> teamIds = userInterestedInTeamRepository.findInterestedTeamIdbyUserId(userId);
        if (teamIds.isEmpty()) {
            return List.of();
        }
        return teamIds;
    }

    private List<TeamWithMembersDTO> buildTeamWithMembersDTOs(List<Team> teams) {
        if (teams == null || teams.isEmpty()) {
            return List.of();
        }

        List<Long> teamIds = teams.stream()
                .map(Team::getId)
                .collect(Collectors.toList());

        List<TeamMembers> allMemberships = teamMembersRepository.findByTeamIdIn(teamIds);
        Map<Long, List<Long>> userIdsByTeamId = new HashMap<>();
        LinkedHashSet<Long> allUserIds = new LinkedHashSet<>();

        for (TeamMembers membership : allMemberships) {
            userIdsByTeamId
                    .computeIfAbsent(membership.getTeamId(), ignored -> new ArrayList<>())
                    .add(membership.getUserId());
            allUserIds.add(membership.getUserId());
        }

        Map<Long, UserProjection> usersById = new HashMap<>();
        if (!allUserIds.isEmpty()) {
            List<UserProjection> users = userRepository.findAllByIdIn(new ArrayList<>(allUserIds));
            for (UserProjection user : users) {
                usersById.put(user.getId(), user);
            }
        }

        List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>(teams.size());
        for (Team team : teams) {
            List<Long> memberIds = userIdsByTeamId.getOrDefault(team.getId(), Collections.emptyList());
            List<UserProjection> members = new ArrayList<>(memberIds.size());
            for (Long memberId : memberIds) {
                UserProjection user = usersById.get(memberId);
                if (user != null) {
                    members.add(user);
                }
            }
            teamsWithMembers.add(new TeamWithMembersDTO(team, members));
        }

        return teamsWithMembers;
    }

}
