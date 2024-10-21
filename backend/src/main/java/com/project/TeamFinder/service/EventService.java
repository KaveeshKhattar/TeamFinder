package com.project.TeamFinder.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.repository.EventRepository;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getEventsByCollegeId(Long collegeId) {
        return eventRepository.findByCollegeId(collegeId);
    }    

    public List<Event> searchEvents(List<Event> globalEvents, String name) {
        return globalEvents.stream()
            .filter(event -> event.getName() != null && event.getName().toLowerCase().contains(name.toLowerCase()))
            .collect(Collectors.toList());
    }

}
