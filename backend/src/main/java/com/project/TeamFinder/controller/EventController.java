package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.service.EventService;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api")
@CrossOrigin
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/{collegeId}/events")
    public ResponseEntity<List<Event>> getEvents(@PathVariable Long collegeId) {
        List<Event> events = eventService.getEventsByCollegeId(collegeId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/college/events/searchEvents")
    public List<Event> getFilteredEvents(@RequestHeader("Authorization") String token, @RequestParam String eventSearchTerm, @RequestParam Long collegeId) {

        List<Event> globalEvents = eventService.getEventsByCollegeId(collegeId);
        List<Event> filteredEvents = eventService.searchEvents(globalEvents, eventSearchTerm);
        return filteredEvents;
    }

    @GetMapping("/events/isUserInterestedAlready")
    public Boolean isUserInterestedAlready(@RequestParam Long userId, @RequestParam Long eventId) {
        List<Long> userIdsWhoAreAlreadyInterested = eventService.getUserIdsWhoAreInterestedAlready(eventId);
        return userIdsWhoAreAlreadyInterested.contains(userId);
    }

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        System.out.println("Called: " + eventService.getAllEvents());
        return eventService.getAllEvents();
    }

    @GetMapping("/events/searchAllEvents")
    public List<Event> getSearchAllEvents(@RequestHeader("Authorization") String token, @RequestParam String eventSearchTerm) {
        List<Event> globalEvents = eventService.getAllEvents();
        List<Event> filteredEvents = eventService.searchEvents(globalEvents, eventSearchTerm);
        return filteredEvents;
    }
    
}


