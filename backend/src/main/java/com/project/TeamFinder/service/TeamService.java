package com.project.TeamFinder.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.model.EventUser;
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
    private final EventUserRepository eventUserRepository;

    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository, UserRepository userRepository, EventUserRepository eventUserRepositroy) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepositroy;
    }

    public List<Team> getTeamsByEventId(Long eventId) {
        return teamRepository.findByEventId(eventId);
    }

    public Team addTeam(Team team) {
        return teamRepository.save(team);
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
        }

        return teamsWithMembers;

    }

    public void addUsersToTeam(Long teamId, List<Long> userIds) {
        // Loop through the list of users and add each one to the team

        for (Long userId : userIds) {
            teamMembersRepository.addUserToTeam(teamId, userId);
        }
    }

    public List<TeamWithMembersDTO> searchTeams(List<TeamWithMembersDTO> globalTeams, String name) {
        return globalTeams.stream()
            .filter(team -> team.getTeamName() != null && team.getTeamName().toLowerCase().contains(name.toLowerCase()))
            .collect(Collectors.toList());
    }

    public List<UserProjection> getInterestedUsers(Long eventID) {
        List<EventUser> interestedUserRows = eventUserRepository.findByEventId(eventID);

        List<Long> userIds = interestedUserRows.stream()
            .map(EventUser::getUserId) // Use method reference to get userId
            .collect(Collectors.toList());

        // List<User> users = (List<User>) userRepository.findAllById(userIds);
        List<UserProjection> interestedUsers = userRepository.findAllByIdIn(userIds);
        return interestedUsers;
    }
    
    public void addInterestedUser(Long eventId, Long id) {        
        if (!eventUserRepository.existsByEventIdAndId(eventId, id)) {
            eventUserRepository.addInterestedUserToEvent(eventId, id);
        }
    }

    public void removeInterestedUser(Long eventId, Long id) {        
        if (eventUserRepository.existsByEventIdAndId(eventId, id)) {
            eventUserRepository.removeInterestedUserFromEvent(eventId, id);
        }
    }

    public List<Long> getTeamIdsPerUserId(Long userId) {
        return teamMembersRepository.findTeamIdByUserId(userId);
    }

    public List<TeamWithMembersDTO> getTeamsPerUserId(List<Long> teamIds) {

        List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();

        for (Long teamId: teamIds) {

            Optional<Team> optionalTeam = teamRepository.findById(teamId);
        
            Team team = optionalTeam.orElseThrow(() -> new RuntimeException("Team not found"));

            List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());

            List<Long> userIds = members.stream()
            .map(TeamMembers::getUserId) // Use method reference to get userId
            .collect(Collectors.toList());

            // List<User> users = (List<User>) userRepository.findAllById(userIds);
            List<UserProjection> users = userRepository.findAllByIdIn(userIds);

            TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
            teamsWithMembers.add(teamWithMembersDTO);
        }

        return teamsWithMembers;

    }

    public Team getTeamById(Long id) {
        Optional<Team> optionalTeam = teamRepository.findById(id);        
        Team team = optionalTeam.orElseThrow(() -> new RuntimeException("Team not found"));

        return team;
    }

    public void updateTeam(Team updatedTeam) {
        teamRepository.save(updatedTeam); // This saves the updated team entity
    }

    public void updateUsersInTeam(Long teamId, List<Long> userIds) {

        // Clear existing user mappings (optional based on your requirements)

        teamMembersRepository.deleteUsersFromTeamByIds(teamId, userIds);

        // Add new user mappings
        for (Long userId : userIds) {
            teamMembersRepository.addUserToTeam(teamId, userId);
        }
    }

    public void updateTeamName(Long id, String name) {
        teamRepository.updateTeamNameById(id, name);
    }

    public void deleteTeam(Long id) {
        // You can perform additional checks here if necessary

        teamRepository.deleteById(id); // This will throw an exception if the ID does not exist
    }

    public void deleteTeamMembers(Long id) {
        // You can perform additional checks here if necessary

        teamMembersRepository.deleteMembers(id); // This will throw an exception if the ID does not exist
    }

    public List<TeamWithMembersDTO> getAllTeams() {
        List<Team> teams = (List<Team>) teamRepository.findAll();
        List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();

        for (Team team: teams) {

            List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());

            List<Long> userIds = members.stream()
            .map(TeamMembers::getUserId) // Use method reference to get userId
            .collect(Collectors.toList());

            // List<User> users = (List<User>) userRepository.findAllById(userIds);
            List<UserProjection> users = userRepository.findAllByIdIn(userIds);

            TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
            teamsWithMembers.add(teamWithMembersDTO);
        }

        return teamsWithMembers;
    }
    
}
