package com.project.TeamFinder.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.exception.NoCollegesException;
import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.model.EventUser;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.EventRepository;
import com.project.TeamFinder.repository.EventUserRepository;
import com.project.TeamFinder.repository.TeamRepository;
import com.project.TeamFinder.repository.UserInterestedInTeamRepository;
import com.project.TeamFinder.repository.UserRepository;
import com.project.TeamFinder.repository.EventLeadRepository;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final EventUserRepository eventUserRepository;
    private final UserRepository userRepository;
    private final EventLeadRepository eventLeadRepository;
    private final UserInterestedInTeamRepository userInterestedInTeamRepository;
    private final TeamRepository teamRepository;
    
    public EventService(EventRepository eventRepository, EventUserRepository eventUserRepository,
            UserRepository userRepository, EventLeadRepository eventLeadRepository, UserInterestedInTeamRepository userInterestedInTeamRepository,
        TeamRepository teamRepository) {
        this.eventRepository = eventRepository;
        this.eventUserRepository = eventUserRepository;
        this.userRepository = userRepository;
        this.eventLeadRepository = eventLeadRepository;
        this.userInterestedInTeamRepository = userInterestedInTeamRepository;
        this.teamRepository = teamRepository;
    }

    public List<Event> getAllEvents() {
        List<Event> events = (List<Event>) eventRepository.findAll();
        if (events.isEmpty()) {
            throw new NoCollegesException("Error fetching events.");
        }
        return events; 
    }

    public List<Long> getInterestedEventsForUser(Long userId) {
        System.out.println("service " + userId);
        return eventUserRepository.findInterestedEventIDsPerUser(userId);
    }

    

    // public List<Event> getEventsByCollegeId(Long collegeId) {
    //     List<Event> events = eventRepository.findByCollegeId(collegeId);
    //     return events;
    // }

    // public List<Event> searchEvents(List<Event> globalEvents, String name) {
    //     return globalEvents.stream()
    //             .filter(event -> event.getName() != null && event.getName().toLowerCase().contains(name.toLowerCase()))
    //             .collect(Collectors.toList());
    // }

    public List<Long> getUserIdsWhoAreInterestedAlready(Long eventId) {
        return eventUserRepository.findUserIdsOfAlreadyInterestedUsers(eventId);
    }

    // public void createEvent(Long collegeId, String eventName, String eventDate, String eventTime, String eventVenue,
    //         Long teamSize, String eventDescription) {
    //     eventRepository.createEvent(collegeId, eventName, eventDate, eventTime, eventVenue, teamSize, eventDescription);
    // }

    // public void updateEvent(Long eventId, String eventName, String eventDate, String eventTime, Long teamSize,
    //         String eventVenue, String eventDescription) {
    //     System.out.println("Updating more...");
    //     eventRepository.updateEvent(eventId, eventName, eventDate, eventTime, eventVenue, teamSize, eventDescription);
    // }

    // public void deleteEvent(Long eventId) {
    //     eventRepository.deleteById(eventId);
    // }

    public List<UserProjection> getInterestedUsers(Long eventID) {
        
        List<EventUser> interestedUserRows = eventUserRepository.findByEventId(eventID);

        List<Long> userIds = interestedUserRows.stream()
                .map(EventUser::getUserId) // Use method reference to get userId
                .collect(Collectors.toList());

        // List<User> users = (List<User>) userRepository.findAllById(userIds);
        List<UserProjection> interestedUsers = userRepository.findAllByIdIn(userIds);
        return interestedUsers;
    }

    public void removeInterestedUser(Long eventId, Long id) {
        if (eventUserRepository.existsByEventIdAndId(eventId, id)) {
            eventUserRepository.removeInterestedUserFromEvent(eventId, id);
        }
    }

    public void toggleInterestedUser(Long eventId, Long id) {
        System.out.println("gonna toggle now again!");
        if (eventUserRepository.existsByEventIdAndId(eventId, id)) {
            eventUserRepository.removeInterestedUserFromEvent(eventId, id);
        } else {
            eventUserRepository.addInterestedUserToEvent(eventId, id);
        }
    }

    public void toggleLead(Long eventId, Long userId1, Long userId2) {
        System.out.println("gonna toggle now again!");
        if (eventLeadRepository.existsByEventIdAndUserId1AndUserId2(eventId, userId1, userId2)) {
            eventLeadRepository.removeLeadFromEvent(eventId, userId1, userId2);
        } else {
            eventLeadRepository.addLeadToEvent(eventId, userId1, userId2);
        }
    }

    public List<UserProjection> getLeadsForUser(Long eventId, Long userId) {
        List<Long> userIds = eventLeadRepository.findUserIdsByEventIdAndUserId1(eventId, userId);
        if (userIds.isEmpty()) {
            return List.of();
        }
        return userRepository.findAllByIdIn(userIds);
    }

    public List<Team> getLeadsTeamsForUser(Long eventId, Long userId) {
        System.out.println("=== DEBUG START ===");
        System.out.println("eventId: " + eventId + ", userId: " + userId);
        
        // Test 1: Get all team IDs for this user
        List<Long> userTeams = userInterestedInTeamRepository.findInterestedTeamIdbyUserId(userId);
        System.out.println("All teams user is interested in: " + userTeams);
        
        // Test 2: Get the full query result
        List<Number> teamIds = userInterestedInTeamRepository.findInterestedTeamIdsByUserAndEvent(userId, eventId);
        System.out.println("Filtered teamIds: " + teamIds);
        System.out.println("teamIds size: " + teamIds.size());
        System.out.println("teamIds isEmpty: " + teamIds.isEmpty());
        
        if (teamIds.isEmpty()) {
            System.out.println("No teams found - returning empty list");
            return List.of();
        }
        
        System.out.println("Looking up teams with IDs: " + teamIds);
        List<Team> teams = teamRepository.findAllByIdIn(teamIds);
        System.out.println("Found teams: " + teams.size());
        System.out.println("=== DEBUG END ===");
        
        return teams;
    }

    public List<Team> getTeamsCreatedByUserForEvent(Long eventId, Long userId) {

        List<Number> teamIds = teamRepository.findUserTeamsByEvent(userId, eventId);
        
        if (teamIds.isEmpty()) {
            System.out.println("No teams found - returning empty list");
            return List.of();
        }
        
        List<Team> teams = teamRepository.findAllByIdIn(teamIds);
        
        return teams;
    }

    

}
