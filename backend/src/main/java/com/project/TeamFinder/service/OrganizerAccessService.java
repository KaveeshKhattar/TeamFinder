package com.project.TeamFinder.service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.model.EventOrganizerRepresentative;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.repository.EventRepository;
import com.project.TeamFinder.repository.EventOrganizerRepresentativeRepository;
import com.project.TeamFinder.repository.TeamRepository;
import com.project.TeamFinder.repository.UserRepository;

@Service
public class OrganizerAccessService {
    private final EventOrganizerRepresentativeRepository eventOrganizerRepresentativeRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final EventRepository eventRepository;

    public OrganizerAccessService(
            EventOrganizerRepresentativeRepository eventOrganizerRepresentativeRepository,
            UserRepository userRepository,
            TeamRepository teamRepository,
            EventRepository eventRepository) {
        this.eventOrganizerRepresentativeRepository = eventOrganizerRepresentativeRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.eventRepository = eventRepository;
    }

    private Optional<Long> resolveUserId(String email) {
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }
        return userRepository.findByEmail(email).map(User::getId);
    }

    public boolean isOrganizer(String email) {
        return resolveUserId(email)
                .map(eventOrganizerRepresentativeRepository::existsByUserId)
                .orElse(false);
    }

    public boolean canManageEvent(String email, Long eventId) {
        if (eventId == null) {
            return false;
        }
        return resolveUserId(email)
                .map(userId -> eventOrganizerRepresentativeRepository.existsByEventIdAndUserId(eventId, userId))
                .orElse(false);
    }

    public boolean canManageTeam(String email, Long teamId) {
        if (teamId == null) {
            return false;
        }
        return teamRepository.findById(teamId)
                .map(team -> canManageEvent(email, team.getEventId()))
                .orElse(false);
    }

    public void grantOrganizerAccess(Long eventId, String targetEmail) {
        if (eventId == null) {
            throw new RuntimeException("eventId is required");
        }
        if (targetEmail == null || targetEmail.isBlank()) {
            throw new RuntimeException("target email is required");
        }
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }

        User targetUser = userRepository.findByEmail(targetEmail.trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean exists = eventOrganizerRepresentativeRepository.existsByEventIdAndUserId(eventId, targetUser.getId());
        if (exists) {
            return;
        }

        EventOrganizerRepresentative representative = new EventOrganizerRepresentative();
        representative.setEventId(eventId);
        representative.setUserId(targetUser.getId());
        eventOrganizerRepresentativeRepository.save(representative);
    }

    public void revokeOrganizerAccess(Long eventId, String targetEmail) {
        if (eventId == null) {
            throw new RuntimeException("eventId is required");
        }
        if (targetEmail == null || targetEmail.isBlank()) {
            throw new RuntimeException("target email is required");
        }
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }

        User targetUser = userRepository.findByEmail(targetEmail.trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        eventOrganizerRepresentativeRepository.deleteByEventIdAndUserId(eventId, targetUser.getId());
    }

    public List<String> getOrganizerEmailsForEvent(Long eventId) {
        if (eventId == null) {
            throw new RuntimeException("eventId is required");
        }
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }

        List<Long> userIds = eventOrganizerRepresentativeRepository.findByEventId(eventId).stream()
                .map(EventOrganizerRepresentative::getUserId)
                .distinct()
                .toList();

        if (userIds.isEmpty()) {
            return List.of();
        }

        return userRepository.findAllById(userIds).stream()
                .map(User::getEmail)
                .sorted()
                .collect(Collectors.toList());
    }
}
