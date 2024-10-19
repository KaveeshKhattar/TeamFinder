package com.project.TeamFinder.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.model.TeamMembers;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.TeamMembersRepository;
import com.project.TeamFinder.repository.TeamRepository;
import com.project.TeamFinder.repository.UserRepository;

@Service
public class TeamService {
    
    private final TeamRepository teamRepository;
    private final TeamMembersRepository teamMembersRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.userRepository = userRepository;
    }

    public List<Team> getTeamsByEventId(Long eventId) {
        System.out.println("Called Team service");
        
        return teamRepository.findByEventId(eventId);
    }

    public List<TeamWithMembersDTO> getAllTeamsWithMembers(Long eventId) {
        // Step 1: Fetch all teams based on eventID
        
        List<Team> teams = teamRepository.findByEventId(eventId);
        List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();
        
        // Step 2: Iterate over each team to get its members
        for (Team team : teams) {

            // Fetch team member IDs using the team ID
            List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());

            List<Long> userIds = members.stream()
            .map(TeamMembers::getUserId) // Use method reference to get userId
            .collect(Collectors.toList());

            // List<User> users = (List<User>) userRepository.findAllById(userIds);
            List<UserProjection> users = userRepository.findAllByIdIn(userIds);
            
            TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
            teamsWithMembers.add(teamWithMembersDTO);
            System.out.println(teamsWithMembers); 
        }

        return teamsWithMembers;

    }
}