package com.project.TeamFinder.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.LeadRequestDTO;
import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.EventUserRepository;
import com.project.TeamFinder.service.EventService;
import com.project.TeamFinder.service.JwtService;
import com.project.TeamFinder.service.TeamService;
import com.project.TeamFinder.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class EventController {

    private final EventService eventService;
    private final TeamService teamService;
    private final UserService userService;
    private final JwtService jwtService;

    public EventController(EventService eventService, UserService userService, JwtService jwtService,
            EventUserRepository eventUserRepository, TeamService teamService) {
        this.eventService = eventService;
        this.teamService = teamService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events); // If no exception is thrown, this will return 200 OK
    }

    @GetMapping("/events/{eventId}/interested-users")
    public List<UserProjection> getInterestedUsers(@PathVariable Long eventId) {
        System.out.println("Fetching interested users for event ID: " + eventId);
        // fetch all user ids who are interested in the event, then return user objects
        List<UserProjection> interestedUsers = eventService.getInterestedUsers(eventId);

        return interestedUsers;
    }

    @GetMapping("/interested-events")
    public ResponseEntity<List<Long>> getInterestedEventsForUser(@RequestHeader("Authorization") String token) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Long> interestedEvents = eventService.getInterestedEventsForUser(user.get().getId());
        return ResponseEntity.ok(interestedEvents);
    }

    @PostMapping("/events/{eventId}/interested-user")
    public ResponseEntity<String> addInterestedUsers(@RequestHeader("Authorization") String token,
            @PathVariable Long eventId) {
        System.out.println("Adding interested user" + " for event ID: " + eventId);
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        System.out.println("Adding interested user" + " for event ID: " + eventId);

        // get user id using userEmail
        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        // toggle instead of just add
        System.out.println("gonna toggle now!");
        eventService.toggleInterestedUser(eventId, user.get().getId());
        return ResponseEntity.ok("User interest toggled");
    }

    @PostMapping("/leads")
    public ResponseEntity<String> toggleLead(@RequestHeader("Authorization") String token,
            @RequestBody LeadRequestDTO leadRequestDTO) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // get user id using userEmail
        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        System.out.println("user id: " + user.get().getId());
        System.out.println("target user id: " + leadRequestDTO.getUserId());
        System.out.println("event id: " + leadRequestDTO.getEventId());
        System.out.println(
                "Adding lead: " + user.get().getId() + leadRequestDTO.getUserId() + leadRequestDTO.getEventId());
        eventService.toggleLead(leadRequestDTO.getEventId(), user.get().getId(), leadRequestDTO.getUserId());

        return ResponseEntity.ok("All ok!");
    }

    @DeleteMapping("/leads")
    public ResponseEntity<String> deleteLead(@RequestHeader("Authorization") String token,
            @RequestBody LeadRequestDTO leadRequestDTO) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        Optional<User> targetUser = userService.findByEmail(userEmail);
        if (targetUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Target user not found");
        }
        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        eventService.toggleLead(leadRequestDTO.getEventId(), targetUser.get().getId(), user.get().getId());
        return ResponseEntity.ok("Lead toggled successfully");
    }

    @GetMapping("/events/{eventId}/leads")
    public ResponseEntity<List<UserProjection>> getLeadsForUser(@RequestHeader("Authorization") String token,
            @PathVariable Long eventId) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<UserProjection> leads = eventService.getLeadsForUser(eventId, user.get().getId());

        System.out.println("leads: " + leads.toString());
        return ResponseEntity.ok(leads);
    }

    @GetMapping("/events/{eventId}/leadsForTeams")
    public ResponseEntity<List<TeamWithMembersDTO>> getLeadsTeamsForUser(@RequestHeader("Authorization") String token,
            @PathVariable Long eventId) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Team> leads = eventService.getLeadsTeamsForUser(eventId, user.get().getId());
        System.out.println("leads: " + leads);

        List<TeamWithMembersDTO> newLeads = new ArrayList<>();

        System.out.println("getting members...");
        for (Team lead : leads) {
            System.out.println("getting members");
            TeamWithMembersDTO team = teamService.getTeam(lead.getId());
            newLeads.add(team);
        }
        
        System.out.println("newLeads: " + newLeads);
        return ResponseEntity.ok(newLeads);
        
    }

    @GetMapping("/events/{eventId}/teams-part-of")
    public ResponseEntity<List<TeamWithMembersDTO>> getTeamsCreatedByUserForEvent(@RequestHeader("Authorization") String token,
            @PathVariable Long eventId) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Team> leads = eventService.getTeamsCreatedByUserForEvent(eventId, user.get().getId());

        List<TeamWithMembersDTO> newLeads = new ArrayList<>();

        for (Team lead : leads) {
            TeamWithMembersDTO team = teamService.getTeam(lead.getId());
            newLeads.add(team);
        }
        
        System.out.println("teams part of: " + newLeads);
        return ResponseEntity.ok(newLeads);
        
    }

    

    // @GetMapping("/{collegeId}/events")
    // public ResponseEntity<List<Event>> getEvents(@PathVariable Long collegeId) {
    // List<Event> events = eventService.getEventsByCollegeId(collegeId);
    // if (events.isEmpty()) {
    // return ResponseEntity.noContent().build(); // 204 No Content
    // }
    // return ResponseEntity.ok(events);
    // }

    // @GetMapping("/events/searchAllEvents")
    // public List<Event> getSearchAllEvents(
    // @RequestParam String eventSearchTerm) {
    // List<Event> globalEvents = eventService.getAllEvents();
    // List<Event> filteredEvents = eventService.searchEvents(globalEvents,
    // eventSearchTerm);
    // return filteredEvents;
    // }

    // @GetMapping("/{collegeId}/searchEvents")
    // public List<Event> getFilteredEvents(
    // @RequestParam String eventSearchTerm, @PathVariable Long collegeId) {

    // // List<Event> globalEvents = eventService.getEventsByCollegeId(collegeId);
    // List<Event> filteredEvents = eventService.searchEvents(globalEvents,
    // eventSearchTerm);
    // return filteredEvents;
    // }

    // @GetMapping("/events/isUserInterestedAlready")
    // public Boolean isUserInterestedAlready(@RequestParam Long userId,
    // @RequestParam Long eventId) {
    // List<Long> userIdsWhoAreAlreadyInterested =
    // eventService.getUserIdsWhoAreInterestedAlready(eventId);
    // return userIdsWhoAreAlreadyInterested.contains(userId);
    // }

    // @PostMapping("events/createEvent")
    // public String createEvent(@RequestBody EventRequestDTO eventRequest) {
    // eventService.createEvent(
    // // eventRequest.getCollegeId(),
    // eventRequest.getEventName(),
    // // eventRequest.getEventDate(),
    // eventRequest.getEventTime(),
    // eventRequest.getEventVenue(),
    // eventRequest.getTeamSize(),
    // // eventRequest.getEventDescription());
    // return eventRequest.getEventName();
    // }

    // @PutMapping("events/event/{eventId}")
    // public void updateEvent(
    // @PathVariable("eventId") Long eventId,
    // @RequestParam("eventName") String eventName,
    // @RequestParam("eventDate") String eventDate,
    // @RequestParam("eventTime") String eventTime,
    // @RequestParam("teamSize") Long teamSize,
    // @RequestParam("eventVenue") String eventVenue,
    // @RequestParam("eventDescription") String eventDescription) {

    // System.out.println("Updating..." + eventName + " " + eventDate);
    // eventService.updateEvent(eventId, eventName, eventDate, eventTime, teamSize,
    // eventVenue, eventDescription);
    // }

    // @DeleteMapping("/events/event/{eventId}")
    // public void deleteEvent( @PathVariable Long eventId) {
    // eventService.deleteEvent(eventId);
    // }

    // @GetMapping("/events/{eventId}/InterestedIndividuals")
    // public List<UserProjection> getInterestedUsers(@PathVariable long eventId) {
    // List<UserProjection> interestedUsers =
    // eventService.getInterestedUsers(eventId);
    // return interestedUsers;
    // }

    // @PostMapping("/events/{eventId}/InterestedIndividual")
    // public ResponseEntity<Long> postInterestedUser(@PathVariable long eventId,
    // @RequestBody EventUserDTO request) {
    // eventService.addInterestedUser(eventId, request.getUserId());
    // return ResponseEntity.ok(request.getUserId());
    // }

    // @DeleteMapping("/events/{eventId}/InterestedIndividual")
    // public ResponseEntity<Long> dropInterestedUser(@PathVariable long eventId,
    // @RequestParam Long userID) {
    // eventService.removeInterestedUser(eventId, userID);
    // return ResponseEntity.ok(userID);
    // }

}
