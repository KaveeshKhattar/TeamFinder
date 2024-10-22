package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.EventUserDTO;
import com.project.TeamFinder.dto.TeamUserRequestDTO;
import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.service.TeamService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/events/{eventId}/teams")
    public ResponseEntity<List<TeamWithMembersDTO>> getTeams(@PathVariable long eventId) {
        List<TeamWithMembersDTO> teamsWithMembers = teamService.getAllTeamsWithMembers(eventId);
        
        return ResponseEntity.ok(teamsWithMembers);
    }

    @GetMapping("/events/{eventId}/InterestedIndividuals")
    public List<UserProjection> getInterestedUsers(@PathVariable long eventId) {
        List<UserProjection> interestedUsers = teamService.getInterestedUsers(eventId);
        return interestedUsers;
    }

    @PostMapping("/events/InterestedIndividual")
    public ResponseEntity<Long> postInterestedUser(@RequestBody EventUserDTO request) {
        teamService.addInterestedUser(request.getEventId(), request.getUserId());
        return ResponseEntity.ok(request.getUserId());
    }
    
    @PostMapping("/teams/team")
    public ResponseEntity<Team> postTeam(@RequestBody Team newTeam) {
        teamService.addTeam(newTeam);
        return ResponseEntity.ok(newTeam);
    }

    @PostMapping("/teams/userTeamMappings")
    public ResponseEntity<TeamUserRequestDTO> postTeamUserMappings(@RequestBody TeamUserRequestDTO request) {
        teamService.addUsersToTeam(request.getTeamId(), request.getUserIds());
        return ResponseEntity.ok(request);
    }

    @PutMapping("/teams/team/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team updatedTeam) {
        // Get the existing team
        Team existingTeam = teamService.getTeamById(id);
        if (existingTeam == null) {
            return ResponseEntity.notFound().build(); // Team not found
        }

        // Update the team name (and other properties as needed)
        existingTeam.setName(updatedTeam.getName()); // If you want to update other fields, you can do that here

        // Use the service method to update the team in the database
        teamService.updateTeamName(id, updatedTeam.getName());

        return ResponseEntity.ok(existingTeam);
    }


    @PutMapping("/teams/userTeamMappings")
    public ResponseEntity<TeamUserRequestDTO> updateTeamUserMappings(@RequestBody TeamUserRequestDTO request) {
        // Assuming teamService has a method to update user-team mappings
        // It might involve checking if the team exists and updating user IDs

        teamService.updateUsersInTeam(request.getTeamId(), request.getUserIds());

        return ResponseEntity.ok(request);
    }



    @GetMapping("/teams/searchTeams")
    public List<TeamWithMembersDTO> getFilteredTeams(@RequestHeader("Authorization") String token, @RequestParam String name, @RequestParam Long eventId) {
        
        List<TeamWithMembersDTO> globalTeams = teamService.getAllTeamsWithMembers(eventId);
        
        List<TeamWithMembersDTO> filteredTeams = teamService.searchTeams(globalTeams, name);
        
        return filteredTeams;
    }

    @GetMapping("/teams/profile")
    public List<TeamWithMembersDTO> getAllTeamsforProfile(@RequestParam Long userId) {
        System.out.println("Called here");
        System.out.println("UserID: " + userId);
        List<Long> teamIds = teamService.getTeamIdsPerUserId(userId);
        List<TeamWithMembersDTO> result = teamService.getTeamsPerUserId(teamIds);
        System.out.println("result: " + result);
        return result;
    }

    @DeleteMapping("/teams/team/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        // You can optionally check if the team exists before attempting to delete
        System.out.println("Deleting...");
        Team existingTeam = teamService.getTeamById(id);
        if (existingTeam == null) {
            return ResponseEntity.notFound().build(); // Team not found
        }

        teamService.deleteTeam(id); // Call service method to delete the team
        teamService.deleteTeamMembers(id); // Call service method to delete the team
        return ResponseEntity.noContent().build(); // Return 204 No Content on success
    }

    

}
