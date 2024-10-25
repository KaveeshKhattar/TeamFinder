package com.project.TeamFinder.dto;

import java.util.List;

public class TeamUserRequestDTO {
    private Long teamId;
    private List<Long> userIds;

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }

    @Override
    public String toString() {
        return "Team ID: " + teamId + " List of users: " + userIds;
    }
}
