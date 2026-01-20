package com.project.TeamFinder.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.CreateTeamRequestDTO;
import com.project.TeamFinder.dto.TeamUserRequestDTO;
import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.model.UserInterestedInTeam;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.service.JwtService;
import com.project.TeamFinder.service.TeamService;
import com.project.TeamFinder.service.UserService;

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
    private final JwtService jwtService;
    private final UserService userService;

    public TeamController(TeamService teamService, JwtService jwtService, UserService userService) {
        this.teamService = teamService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    // @GetMapping("/teams")
    // public List<TeamWithMembersDTO> getAllTeams() {
    //     return teamService.getAllTeams();
    // }

    @GetMapping("/events/{eventId}/teams")
    public ResponseEntity<List<TeamWithMembersDTO>> getTeams(@PathVariable long eventId) {
        List<TeamWithMembersDTO> teamsWithMembers = teamService.getAllTeamsWithMembers(eventId);
        return ResponseEntity.ok(teamsWithMembers);
    }

    // @GetMapping("/teams/searchAllTeams")
    // public List<TeamWithMembersDTO> searchTeams(@RequestHeader("Authorization") String token,
    //         @RequestParam String teamSearchTerm) {
    //     List<TeamWithMembersDTO> globalTeams = teamService.getAllTeams();
    //     List<TeamWithMembersDTO> filteredTeams = teamService.searchTeams(globalTeams, teamSearchTerm);
    //     return filteredTeams;
    // }

    // Create team for an event
    @PostMapping("/team")
    public void postTeam(@RequestBody CreateTeamRequestDTO newTeam) {
        teamService.addTeam(newTeam);
    }

    @PostMapping("/teams/{teamId}/favorite")
    public ResponseEntity<String> toggleLead(@RequestHeader("Authorization") String token, @PathVariable Long teamId) {
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
        System.out.println("target team id: " + teamId);

        teamService.toggleLead(teamId, user.get().getId());

        return ResponseEntity.ok("All ok!");
    }

    @DeleteMapping("/teams/{teamId}/favorite")
    public ResponseEntity<String> deleteLead(@RequestHeader("Authorization") String token, @RequestBody UserInterestedInTeam userInterestedInTeamDTO) {
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
        teamService.toggleLead(userInterestedInTeamDTO.getTeamId(), user.get().getId());
        return ResponseEntity.ok("Lead toggled successfully");
    }

    @GetMapping("/interested-teams")
    public ResponseEntity<List<Long>> getLeadsForUser(@RequestHeader("Authorization") String token) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Long> leads = teamService.getInterestedTeamsForEvent(user.get().getId());
        
        System.out.println("leads: " + leads.toString());
        return ResponseEntity.ok(leads);
    }

    // // Update team from profile page
    // @PutMapping("/teams/{id}")
    // public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team updatedTeam) {
    //     // Get the existing team
    //     Team existingTeam = teamService.getTeamById(id);
    //     if (existingTeam == null) {
    //         return ResponseEntity.notFound().build(); // Team not found
    //     }
    //     existingTeam.setName(updatedTeam.getName());
    //     teamService.updateTeamName(id, updatedTeam.getName());
    //     return ResponseEntity.ok(existingTeam);
    // }

    // // Delete team from profile page
    // @DeleteMapping("/teams/{id}")
    // public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
    //     Team existingTeam = teamService.getTeamById(id);
    //     if (existingTeam == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     teamService.deleteTeamMembers(id);
    //     teamService.deleteTeam(id);
    //     return ResponseEntity.noContent().build();
    // }

    // // Add user_ids for a team in Supabase (DB)
    // @PostMapping("/teams/userTeamMappings")
    // public ResponseEntity<TeamUserRequestDTO> postTeamUserMappings(@RequestBody TeamUserRequestDTO request) {

    //     teamService.addUsersToTeam(request.getTeamId(), request.getUserIds());
    //     return ResponseEntity.ok(request);
    // }

    // // Update user_ids for a team in Supabase (DB)
    // @PutMapping("/teams/userTeamMappings")
    // public ResponseEntity<TeamUserRequestDTO> updateTeamUserMappings(@RequestBody TeamUserRequestDTO request) {
    //     teamService.updateUsersInTeam(request.getTeamId(), request.getUserIds());
    //     return ResponseEntity.ok(request);
    // }

    // @GetMapping("/teams/profile")
    // public List<TeamWithMembersDTO> getAllTeamsforProfile(@RequestParam Long userId) {
    //     List<Long> teamIds = teamService.getTeamIdsPerUserId(userId);
    //     List<TeamWithMembersDTO> result = teamService.getTeamsPerUserId(teamIds);
    //     return result;
    // }

    // @GetMapping("/isPartOfAny")
    // public Boolean getTeamsForUserProfile(@RequestParam Long eventId, @RequestParam Long userId) {
    //     List<TeamWithMembersDTO> globalTeams = teamService.getAllTeamsWithMembers(eventId);
    //     for (TeamWithMembersDTO team : globalTeams) {
    //         if (team.getMembers() != null) {
    //             for (UserProjection member : team.getMembers()) {
    //                 if (member.getId().equals(userId)) {
    //                     return true; // User is part of this team
    //                 }
    //             }
    //         }
    //     }
    //     return false; // User is not part of any teams
    // }

}
