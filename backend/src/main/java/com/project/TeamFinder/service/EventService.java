package com.project.TeamFinder.service;

import java.util.List;

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
        System.out.println("Called service");
        List<Event> colleges = eventRepository.findByCollegeId(collegeId);
        System.out.println(colleges);
        return eventRepository.findByCollegeId(collegeId);
    }    

}
