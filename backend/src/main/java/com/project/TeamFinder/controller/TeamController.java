package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.TeamUserRequestDTO;
import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.service.TeamService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/api")
@CrossOrigin
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<TeamWithMembersDTO>> getTeams(@PathVariable long eventId) {
        List<TeamWithMembersDTO> teamsWithMembers = teamService.getAllTeamsWithMembers(eventId);
        
        return ResponseEntity.ok(teamsWithMembers);
    }

    @PostMapping("/teams/createTeam")
    public ResponseEntity<Team> postTeam(@RequestBody Team newTeam) {
        System.out.println("Called create Team controller");
        System.out.println("Team" + newTeam);
        teamService.addTeam(newTeam);
        return ResponseEntity.ok(newTeam);
    }

    @PostMapping("/teams/createUserTeamMappings")
    public ResponseEntity<TeamUserRequestDTO> postTeamUserMappings(@RequestBody TeamUserRequestDTO request) {
        System.out.println("Called create Team User Mappings controller");
        System.out.println("Team: " + request);
        teamService.addUsersToTeam(request.getTeamId(), request.getUserIds());
        return ResponseEntity.ok(request);
    }
    
}
