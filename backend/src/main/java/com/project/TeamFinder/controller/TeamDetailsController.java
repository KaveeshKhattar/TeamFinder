package com.project.TeamFinder.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.service.TeamService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class TeamDetailsController {
    private final TeamService teamService;

    public TeamDetailsController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/teams/{teamId}")
    public String getTeamDetails(@PathVariable long teamId) {
        return new String();
    }
    
}
