package com.project.TeamFinder.controller;

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

import com.project.TeamFinder.dto.CreateTeamRequestDTO;
import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.dto.UserDTO;
import com.project.TeamFinder.dto.responses.ApiResponse;

import com.project.TeamFinder.model.UserInterestedInTeam;
import com.project.TeamFinder.service.TeamService;
import com.project.TeamFinder.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class TeamController {
    private final TeamService teamService;

    private final UserService userService;

    public TeamController(TeamService teamService, UserService userService) {
        this.teamService = teamService;
        this.userService = userService;
    }

    @GetMapping("/events/{eventId}/teams")
    public ResponseEntity<List<TeamWithMembersDTO>> getTeams(@PathVariable long eventId) {
        List<TeamWithMembersDTO> teamsWithMembers = teamService.getAllTeamsWithMembers(eventId);
        return ResponseEntity.ok(teamsWithMembers);
    }

    // Create team for an event
    @PostMapping("/team")
    public ResponseEntity<ApiResponse<String>> postTeam(@RequestBody CreateTeamRequestDTO newTeam) {
        teamService.addTeam(newTeam);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse<>(
                        true,
                        "created team",
                        "created team"));
    }

    @PostMapping("/teams/{teamId}/favorite")
    public ResponseEntity<ApiResponse<String>> toggleLead(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long teamId) {

        final String userEmail = userDetails.getUsername();

        // get user id using userEmail
        UserDTO userProfile = userService.getProfile(userEmail);

        teamService.toggleLead(teamId, userProfile.getId());

        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse<>(
                        true,
                        "team favourited",
                        "team favourited"));
    }

    @DeleteMapping("/teams/{teamId}/favorite")
    public ResponseEntity<ApiResponse<String>> deleteLead(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserInterestedInTeam userInterestedInTeamDTO) {

        final String userEmail = userDetails.getUsername();
        UserDTO user = userService.getProfile(userEmail);

        teamService.toggleLead(userInterestedInTeamDTO.getTeamId(), user.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse<>(
                        true,
                        "team un-favourited",
                        "team un-favourited"));
    }

    @GetMapping("/interested-teams")
    public ResponseEntity<ApiResponse<List<Long>>> getLeadsForUser(@AuthenticationPrincipal UserDetails userDetails) {

        UserDTO user = userService.getProfile(userDetails.getUsername());
        List<Long> leads = teamService.getInterestedTeamsForEvent(user.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse<>(
                        true,
                        leads,
                        "getting interested teams"));

    }

}
