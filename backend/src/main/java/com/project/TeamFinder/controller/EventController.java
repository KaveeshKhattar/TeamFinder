package com.project.TeamFinder.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.LeadRequestDTO;
import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.dto.UserDTO;
import com.project.TeamFinder.dto.responses.ApiResponse;
import com.project.TeamFinder.model.Event;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.EventUserRepository;
import com.project.TeamFinder.service.EventService;
import com.project.TeamFinder.service.TeamService;
import com.project.TeamFinder.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class EventController {

    private final EventService eventService;
    private final TeamService teamService;
    private final UserService userService;

    public EventController(EventService eventService, UserService userService,
            EventUserRepository eventUserRepository, TeamService teamService) {
        this.eventService = eventService;
        this.teamService = teamService;
        this.userService = userService;
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<Event>>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            events,
                            "all events"));
    }

    @GetMapping("/events/{eventId}/interested-users")
    public List<UserProjection> getInterestedUsers(@PathVariable Long eventId) {

        // fetch all user ids who are interested in the event, then return user objects
        return eventService.getInterestedUsers(eventId);
    }

    @PostMapping("/events/{eventId}/interested-user")
    public ResponseEntity<ApiResponse<String>> addInterestedUsers(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long eventId) {
        
        final String userEmail = userDetails.getUsername();
        UserDTO userProfile = userService.getProfile(userEmail);
        
        // toggle instead of just add
        eventService.toggleInterestedUser(eventId, userProfile.getId());
        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            "user interest added",
                            "user interest added"));
    }

    // fetch events user is interested in
    @GetMapping("/interested-events")
    public ResponseEntity<ApiResponse<List<Long>>> getInterestedEventsForUser(@AuthenticationPrincipal UserDetails userDetails) {

        final String userEmail = userDetails.getUsername();
        UserDTO userProfile = userService.getProfile(userEmail);

        List<Long> interestedEvents = eventService.getInterestedEventsForUser(userProfile.getId());
        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            interestedEvents,
                            "interested events"));
    }
    
    // fetch people user is interested in for an event
    @GetMapping("/events/{eventId}/leads")
    public ResponseEntity<ApiResponse<List<UserProjection>>> getLeadsForUser(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long eventId) {
        
        final String userEmail = userDetails.getUsername();
        UserDTO userProfile = userService.getProfile(userEmail);

        List<UserProjection> leads = eventService.getLeadsForUser(eventId, userProfile.getId());
        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            leads,
                            "interested events"));
    }

    // add people user is interested in for an event
    @PostMapping("/leads")
    public ResponseEntity<ApiResponse<String>> toggleLead(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody LeadRequestDTO leadRequestDTO) {
        
        final String userEmail = userDetails.getUsername();
        // get user id using userEmail
        UserDTO userProfile = userService.getProfile(userEmail);
        eventService.toggleLead(leadRequestDTO.getEventId(), userProfile.getId(), leadRequestDTO.getUserId());

        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            "interested in event",
                            "interested events"));
    }

    // remove people user is not interested in for an event
    @DeleteMapping("/leads")
    public ResponseEntity<ApiResponse<String>> deleteLead(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody LeadRequestDTO leadRequestDTO) {
        
        final String userEmail = userDetails.getUsername();
        UserDTO user = userService.getProfile(userEmail);
        
        eventService.toggleLead(leadRequestDTO.getEventId(), leadRequestDTO.getUserId(), user.getId());
        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            "not interested in event",
                            "not interested events"));
        
    }

    // fetch teams user is interested in for an event
    @GetMapping("/events/{eventId}/leadsForTeams")
    public ResponseEntity<ApiResponse<List<TeamWithMembersDTO>>> getLeadsTeamsForUser(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long eventId) {

        final String userEmail = userDetails.getUsername();
        UserDTO user = userService.getProfile(userEmail);

        List<Team> leads = eventService.getLeadsTeamsForUser(eventId, user.getId());

        List<TeamWithMembersDTO> newLeads = new ArrayList<>();

        for (Team lead : leads) {

            TeamWithMembersDTO team = teamService.getTeam(lead.getId());
            newLeads.add(team);
        }
        
        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            newLeads,
                            "not interested events"));
        
    }

    // fetch teams user created for an event
    @GetMapping("/events/{eventId}/teams-part-of")
    public ResponseEntity<List<TeamWithMembersDTO>> getTeamsCreatedByUserForEvent(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long eventId) {

        final String userEmail = userDetails.getUsername();
        UserDTO user = userService.getProfile(userEmail);

        List<Team> leads = eventService.getTeamsCreatedByUserForEvent(eventId, user.getId());

        List<TeamWithMembersDTO> newLeads = new ArrayList<>();

        for (Team lead : leads) {
            TeamWithMembersDTO team = teamService.getTeam(lead.getId());
            newLeads.add(team);
        }
        
        return ResponseEntity.ok(newLeads);
        
    }

}
