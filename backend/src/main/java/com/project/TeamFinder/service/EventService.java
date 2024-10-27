package com.project.TeamFinder.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.repository.EventRepository;
import com.project.TeamFinder.repository.EventUserRepository;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final EventUserRepository eventUserRepository;

    public EventService(EventRepository eventRepository, EventUserRepository eventUserRepository) {
        this.eventRepository = eventRepository;
        this.eventUserRepository = eventUserRepository;
    }

    public List<Event> getEventsByCollegeId(Long collegeId) {
        return eventRepository.findByCollegeId(collegeId);
    }    

    public List<Event> searchEvents(List<Event> globalEvents, String name) {
        return globalEvents.stream()
            .filter(event -> event.getName() != null && event.getName().toLowerCase().contains(name.toLowerCase()))
            .collect(Collectors.toList());
    }

    public List<Long> getUserIdsWhoAreInterestedAlready(Long eventId) {
        return eventUserRepository.findUserIdsOfAlreadyInterestedUsers(eventId);
    }

    public List<Event> getAllEvents() {
        return (List<Event>) eventRepository.findAll();
    }

    public void createEvent(Long collegeId, String eventName, String eventDate, String eventTime, String eventVenue, Long teamSize, String eventDescription) {
        eventRepository.createEvent(collegeId, eventName, eventDate, eventTime, eventVenue, teamSize, eventDescription);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public void updateEvent(Long eventId, String eventName, String eventDate, String eventTime, Long teamSize, String eventVenue, String eventDescription) {
        System.out.println("Updating more...");
        eventRepository.updateEvent(eventId, eventName, eventDate, eventTime, eventVenue, teamSize, eventDescription);
    }

}
