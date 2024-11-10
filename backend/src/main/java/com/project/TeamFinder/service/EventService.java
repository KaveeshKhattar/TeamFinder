package com.project.TeamFinder.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.exception.NoCollegesException;
import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.model.EventUser;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.EventRepository;
import com.project.TeamFinder.repository.EventUserRepository;
import com.project.TeamFinder.repository.UserRepository;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final EventUserRepository eventUserRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, EventUserRepository eventUserRepository,
            UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.eventUserRepository = eventUserRepository;
        this.userRepository = userRepository;
    }

    public List<Event> getAllEvents() {
        List<Event> events = (List<Event>) eventRepository.findAll();
        if (events.isEmpty()) {
            throw new NoCollegesException("Error fetching events.");
        }
        return events; 
    }

    public List<Event> getEventsByCollegeId(Long collegeId) {
        List<Event> events = eventRepository.findByCollegeId(collegeId);
        return events;
    }

    public List<Event> searchEvents(List<Event> globalEvents, String name) {
        return globalEvents.stream()
                .filter(event -> event.getName() != null && event.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Long> getUserIdsWhoAreInterestedAlready(Long eventId) {
        return eventUserRepository.findUserIdsOfAlreadyInterestedUsers(eventId);
    }

    public void createEvent(Long collegeId, String eventName, String eventDate, String eventTime, String eventVenue,
            Long teamSize, String eventDescription) {
        eventRepository.createEvent(collegeId, eventName, eventDate, eventTime, eventVenue, teamSize, eventDescription);
    }

    public void updateEvent(Long eventId, String eventName, String eventDate, String eventTime, Long teamSize,
            String eventVenue, String eventDescription) {
        System.out.println("Updating more...");
        eventRepository.updateEvent(eventId, eventName, eventDate, eventTime, eventVenue, teamSize, eventDescription);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public List<UserProjection> getInterestedUsers(Long eventID) {
        List<EventUser> interestedUserRows = eventUserRepository.findByEventId(eventID);

        List<Long> userIds = interestedUserRows.stream()
                .map(EventUser::getUserId) // Use method reference to get userId
                .collect(Collectors.toList());

        // List<User> users = (List<User>) userRepository.findAllById(userIds);
        List<UserProjection> interestedUsers = userRepository.findAllByIdIn(userIds);
        return interestedUsers;
    }

    public void addInterestedUser(Long eventId, Long id) {
        if (!eventUserRepository.existsByEventIdAndId(eventId, id)) {
            eventUserRepository.addInterestedUserToEvent(eventId, id);
        }
    }

    public void removeInterestedUser(Long eventId, Long id) {
        if (eventUserRepository.existsByEventIdAndId(eventId, id)) {
            eventUserRepository.removeInterestedUserFromEvent(eventId, id);
        }
    }

}
