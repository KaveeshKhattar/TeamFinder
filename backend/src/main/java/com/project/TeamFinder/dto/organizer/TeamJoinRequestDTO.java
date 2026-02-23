package com.project.TeamFinder.dto.organizer;

public class TeamJoinRequestDTO {
    private Long teamId;
    private String teamName;
    private Long userId;
    private String userEmail;
    private String firstName;
    private String lastName;

    public TeamJoinRequestDTO(Long teamId, String teamName, Long userId, String userEmail, String firstName, String lastName) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.userId = userId;
        this.userEmail = userEmail;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Long getTeamId() {
        return teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
