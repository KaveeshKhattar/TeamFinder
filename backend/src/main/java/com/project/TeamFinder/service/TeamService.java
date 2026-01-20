package com.project.TeamFinder.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.CreateTeamRequestDTO;
import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.model.TeamMembers;
import com.project.TeamFinder.model.UserInterestedInTeam;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.EventUserRepository;
import com.project.TeamFinder.repository.TeamMembersRepository;
import com.project.TeamFinder.repository.TeamRepository;
import com.project.TeamFinder.repository.UserInterestedInTeamRepository;
import com.project.TeamFinder.repository.UserRepository;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMembersRepository teamMembersRepository;
    private final UserInterestedInTeamRepository userInterestedInTeamRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository,
            UserRepository userRepository, EventUserRepository eventUserRepositroy,
            UserInterestedInTeamRepository userInterestedInTeamRepository) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.userRepository = userRepository;
        this.userInterestedInTeamRepository = userInterestedInTeamRepository;
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

    public void addTeam(CreateTeamRequestDTO team) {

        Team newTeam = new Team();

        newTeam.setName(team.getTeamName());
        newTeam.setEventId(team.getEventId());

        Team savedTeam = teamRepository.save(newTeam);
        Long teamId = savedTeam.getId();

        if (team.getUserIds() != null && !team.getUserIds().isEmpty()) {
            for (Long userId : team.getUserIds()) {
                System.out.println("userId " + userId);
                teamMembersRepository.addUserToTeam(teamId, userId);

            }
        }

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
    // List<Team> teams = (List<Team>) teamRepository.findAll();
    // List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();

    // for (Team team : teams) {

    // List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());

    // List<Long> userIds = members.stream()
    // .map(TeamMembers::getUserId)
    // .collect(Collectors.toList());

    // List<UserProjection> users = userRepository.findAllByIdIn(userIds);

    // TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
    // teamsWithMembers.add(teamWithMembersDTO);
    // }

    // return teamsWithMembers;
    // }

    public Team getTeamById(Long id) {
        Optional<Team> optionalTeam = teamRepository.findById(id);
        Team team = optionalTeam.orElseThrow(() -> new RuntimeException("Team not found"));

        return team;
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

    public TeamWithMembersDTO getTeam(Long teamId) {
        // Step 1: Fetch all teams based on eventID

        Optional<Team> team = teamRepository.findById(teamId);
        TeamWithMembersDTO teamWithMembers;

        if (team.isEmpty()) {
            return null;
        }

        // Step 2: Iterate over each team to get its members

        // Fetch team member IDs using the team ID
        List<TeamMembers> members = teamMembersRepository.findByTeamId(teamId);

        List<Long> userIds = members.stream()
                .map(TeamMembers::getUserId) // Use method reference to get userId
                .collect(Collectors.toList());

        // List<User> users = (List<User>) userRepository.findAllById(userIds);
        List<UserProjection> users = userRepository.findAllByIdIn(userIds);


        TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team.get(), users);
        teamWithMembers = teamWithMembersDTO;
        

        return teamWithMembers;

    }

    // public List<Long> getTeamIdsPerUserId(Long userId) {
    // return teamMembersRepository.findTeamIdByUserId(userId);
    // }

    // public List<TeamWithMembersDTO> getTeamsPerUserId(List<Long> teamIds) {

    // List<TeamWithMembersDTO> teamsWithMembers = new ArrayList<>();
    // for (Long teamId : teamIds) {
    // Optional<Team> optionalTeam = teamRepository.findById(teamId);
    // Team team = optionalTeam.orElseThrow(() -> new RuntimeException("Team not
    // found"));
    // List<TeamMembers> members = teamMembersRepository.findByTeamId(team.getId());
    // List<Long> userIds = members.stream()
    // .map(TeamMembers::getUserId) // Use method reference to get userId
    // .collect(Collectors.toList());

    // List<UserProjection> users = userRepository.findAllByIdIn(userIds);
    // TeamWithMembersDTO teamWithMembersDTO = new TeamWithMembersDTO(team, users);
    // teamsWithMembers.add(teamWithMembersDTO);
    // }
    // return teamsWithMembers;

    // }

    public void toggleLead(Long teamId, Long userId) {
        System.out.println("gonna toggle now again!");
        if (userInterestedInTeamRepository.existsByUserIdAndTeamId(teamId, userId)) {
            userInterestedInTeamRepository.removeUserInterestedInTeam(teamId, userId);
        } else {
            userInterestedInTeamRepository.addUserInterestedInTeam(teamId, userId);
        }
    }

    public List<Long> getInterestedTeamsForEvent(Long userId) {
        List<Long> teamIds = userInterestedInTeamRepository.findInterestedTeamIdbyUserId(userId);
        if (teamIds.isEmpty()) {
            return List.of();
        }
        return teamIds;
    }

}
