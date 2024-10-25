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
        System.out.println("NIGGA AGAIN");
        List<Long> userIdsWhoAreAlreadyInterested = eventUserRepository.findUserIdsOfAlreadyInterestedUsers(eventId);
        System.out.println("already niggas: " + userIdsWhoAreAlreadyInterested);
        return eventUserRepository.findUserIdsOfAlreadyInterestedUsers(eventId);
    }
}
