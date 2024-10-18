package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.service.CollegeService;
import com.project.TeamFinder.service.EventService;


@RestController
@RequestMapping("/api/colleges")
@CrossOrigin
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/{collegeId}")
    public ResponseEntity<List<Event>> getEvents(@PathVariable Long collegeId) {
        System.out.println("Called");
        List<Event> events = eventService.getEventsByCollegeId(collegeId);
        return ResponseEntity.ok(events);
    }
}


