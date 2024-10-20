package com.project.TeamFinder.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
public class TeamDetailsService {
    
    private final TeamRepository teamRepository;
    private final TeamMembersRepository teamMembersRepository;
    private final UserRepository userRepository;

    public TeamDetailsService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.userRepository = userRepository;
    }

    public List<TeamWithMembersDTO> getTeamWithMembers(Long teamId) {
        // Step 1: Fetch all teams based on eventID
        
        Optional<Team> team = teamRepository.findById(teamId);
        List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();
        
        List<TeamMembers> members = teamMembersRepository.findByTeamId(teamId);

        List<Long> userIds = members.stream()
        .map(TeamMembers::getUserId) // Use method reference to get userId
        .collect(Collectors.toList());

        // List<User> users = (List<User>) userRepository.findAllById(userIds);
        List<UserProjection> users = userRepository.findAllByIdIn(userIds);
        
        TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
        teamsWithMembers.add(teamWithMembersDTO);
        System.out.println(teamsWithMembers); 

        return teamsWithMembers;

    }
}
