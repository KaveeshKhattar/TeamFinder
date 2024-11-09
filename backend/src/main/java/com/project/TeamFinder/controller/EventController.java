package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.EventRequestDTO;
import com.project.TeamFinder.dto.EventUserDTO;
import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.service.EventService;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        System.out.println("Called here");
        return eventService.getAllEvents();
    }

    @GetMapping("/{collegeId}/events")
    public ResponseEntity<List<Event>> getEvents(@PathVariable Long collegeId) {
        List<Event> events = eventService.getEventsByCollegeId(collegeId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/events/searchAllEvents")
    public List<Event> getSearchAllEvents(
            @RequestParam String eventSearchTerm) {
        List<Event> globalEvents = eventService.getAllEvents();
        List<Event> filteredEvents = eventService.searchEvents(globalEvents, eventSearchTerm);
        return filteredEvents;
    }

    @GetMapping("/{collegeId}/searchEvents")
    public List<Event> getFilteredEvents(
            @RequestParam String eventSearchTerm, @PathVariable Long collegeId) {

        List<Event> globalEvents = eventService.getEventsByCollegeId(collegeId);
        List<Event> filteredEvents = eventService.searchEvents(globalEvents, eventSearchTerm);
        return filteredEvents;
    }

    @GetMapping("/events/isUserInterestedAlready")
    public Boolean isUserInterestedAlready(@RequestParam Long userId, @RequestParam Long eventId) {
        List<Long> userIdsWhoAreAlreadyInterested = eventService.getUserIdsWhoAreInterestedAlready(eventId);
        return userIdsWhoAreAlreadyInterested.contains(userId);
    }

    @PostMapping("events/createEvent")
    public String createEvent(@RequestBody EventRequestDTO eventRequest) {
        eventService.createEvent(
                eventRequest.getCollegeId(),
                eventRequest.getEventName(),
                eventRequest.getEventDate(),
                eventRequest.getEventTime(),
                eventRequest.getEventVenue(),
                eventRequest.getTeamSize(),
                eventRequest.getEventDescription());
        return eventRequest.getEventName();
    }

    @PutMapping("events/event/{eventId}")
    public void updateEvent(
            @PathVariable("eventId") Long eventId,
            @RequestParam("eventName") String eventName,
            @RequestParam("eventDate") String eventDate,
            @RequestParam("eventTime") String eventTime,
            @RequestParam("teamSize") Long teamSize,
            @RequestParam("eventVenue") String eventVenue,
            @RequestParam("eventDescription") String eventDescription) {

        System.out.println("Updating..." + eventName + " " + eventDate);
        eventService.updateEvent(eventId, eventName, eventDate, eventTime, teamSize, eventVenue, eventDescription);
    }

    @DeleteMapping("/events/event/{eventId}")
    public void deleteEvent( @PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
    }

    @GetMapping("/events/{eventId}/InterestedIndividuals")
    public List<UserProjection> getInterestedUsers(@PathVariable long eventId) {
        List<UserProjection> interestedUsers = eventService.getInterestedUsers(eventId);
        return interestedUsers;
    }

    @PostMapping("/events/{eventId}/InterestedIndividual")
    public ResponseEntity<Long> postInterestedUser(@PathVariable long eventId, @RequestBody EventUserDTO request) {
        eventService.addInterestedUser(eventId, request.getUserId());
        return ResponseEntity.ok(request.getUserId());
    }

    @DeleteMapping("/events/{eventId}/InterestedIndividual")
    public ResponseEntity<Long> dropInterestedUser(@PathVariable long eventId, @RequestParam Long userID) {
        eventService.removeInterestedUser(eventId, userID);
        return ResponseEntity.ok(userID);
    }

}
