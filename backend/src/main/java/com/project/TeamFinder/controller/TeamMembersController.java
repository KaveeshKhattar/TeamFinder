// package com.project.TeamFinder.controller;

// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("/api")
// @CrossOrigin
// public class TeamMembersController {
//     private final TeamMembersService teamMembersService;

//     public TeamMembersController(TeamMembersService teamMembersService) {
//         this.teamMembersService = teamMembersService;
//     }

//     @GetMapping("/teams/{teamId}")
//     public ResponseEntity<List<User>> getTeamMembers(@PathVariable long teamId) {
//         List<User> members = teamMembersService.getMembersByTeamId(teamId);
//         return ResponseEntity.ok(members);
//     }
// }
