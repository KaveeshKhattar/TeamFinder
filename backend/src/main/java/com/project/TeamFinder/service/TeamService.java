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
import com.project.TeamFinder.repository.EventUserRepository;
import com.project.TeamFinder.repository.TeamMembersRepository;
import com.project.TeamFinder.repository.TeamRepository;
import com.project.TeamFinder.repository.UserRepository;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMembersRepository teamMembersRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository,
            UserRepository userRepository, EventUserRepository eventUserRepositroy) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.userRepository = userRepository;
    }

    public List<Team> getTeamsByEventId(Long eventId) {
        return teamRepository.findByEventId(eventId);
    }

    public List<TeamWithMembersDTO> searchTeams(List<TeamWithMembersDTO> globalTeams, String name) {
        return globalTeams.stream()
                .filter(team -> team.getTeamName() != null
                        && team.getTeamName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Team addTeam(Team team) {
        return teamRepository.save(team);
    }

    public void addUsersToTeam(Long teamId, List<Long> userIds) {
        for (Long userId : userIds) {
            teamMembersRepository.addUserToTeam(teamId, userId);
        }
    }

    public void updateTeam(Team updatedTeam) {
        teamRepository.save(updatedTeam); // This saves the updated team entity
    }

    public void updateTeamName(Long id, String name) {
        teamRepository.updateTeamNameById(id, name);
    }

    public void updateUsersInTeam(Long teamId, List<Long> userIds) {
        teamMembersRepository.deleteMembers(teamId);
        for (Long userId : userIds) {
            teamMembersRepository.addUserToTeam(teamId, userId);
        }
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    public void deleteTeamMembers(Long id) {
        teamMembersRepository.deleteMembers(id);
    }

    // public List<TeamWithMembersDTO> getAllTeams() {
    //     List<Team> teams = (List<Team>) teamRepository.findAll();
    //     List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();

    //     for (Team team : teams) {

    //         List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());

    //         List<Long> userIds = members.stream()
    //                 .map(TeamMembers::getUserId)
    //                 .collect(Collectors.toList());

    //         List<UserProjection> users = userRepository.findAllByIdIn(userIds);

    //         TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
    //         teamsWithMembers.add(teamWithMembersDTO);
    //     }

    //     return teamsWithMembers;
    // }

    public Team getTeamById(Long id) {
        Optional<Team> optionalTeam = teamRepository.findById(id);
        Team team = optionalTeam.orElseThrow(() -> new RuntimeException("Team not found"));

        return team;
    }

    // public List<TeamWithMembersDTO> getAllTeamsWithMembers(Long eventId) {
    //     // Step 1: Fetch all teams based on eventID

    //     List<Team> teams = teamRepository.findByEventId(eventId);
    //     List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();

    //     // Step 2: Iterate over each team to get its members
    //     for (Team team : teams) {

    //         // Fetch team member IDs using the team ID
    //         List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());

    //         List<Long> userIds = members.stream()
    //                 .map(TeamMembers::getUserId) // Use method reference to get userId
    //                 .collect(Collectors.toList());

    //         // List<User> users = (List<User>) userRepository.findAllById(userIds);
    //         List<UserProjection> users = userRepository.findAllByIdIn(userIds);

    //         TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
    //         teamsWithMembers.add(teamWithMembersDTO);
    //     }

    //     return teamsWithMembers;

    // }

    public List<Long> getTeamIdsPerUserId(Long userId) {
        return teamMembersRepository.findTeamIdByUserId(userId);
    }

    // public List<TeamWithMembersDTO> getTeamsPerUserId(List<Long> teamIds) {

    //     List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();
    //     for (Long teamId : teamIds) {
    //         Optional<Team> optionalTeam = teamRepository.findById(teamId);
    //         Team team = optionalTeam.orElseThrow(() -> new RuntimeException("Team not found"));
    //         List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());
    //         List<Long> userIds = members.stream()
    //                 .map(TeamMembers::getUserId) // Use method reference to get userId
    //                 .collect(Collectors.toList());

    //         List<UserProjection> users = userRepository.findAllByIdIn(userIds);
    //         TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
    //         teamsWithMembers.add(teamWithMembersDTO);
    //     }
    //     return teamsWithMembers;

    // }

}
