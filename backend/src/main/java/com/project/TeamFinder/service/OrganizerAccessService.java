package com.project.TeamFinder.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.model.User;
import com.project.TeamFinder.repository.EventOrganizerRepresentativeRepository;
import com.project.TeamFinder.repository.TeamRepository;
import com.project.TeamFinder.repository.UserRepository;

@Service
public class OrganizerAccessService {
    private final EventOrganizerRepresentativeRepository eventOrganizerRepresentativeRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    public OrganizerAccessService(
            EventOrganizerRepresentativeRepository eventOrganizerRepresentativeRepository,
            UserRepository userRepository,
            TeamRepository teamRepository) {
        this.eventOrganizerRepresentativeRepository = eventOrganizerRepresentativeRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
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
}
