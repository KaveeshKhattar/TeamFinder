package com.project.TeamFinder.dto.organizer;

import java.util.List;

public class UpdateTeamOrganizerRequestDTO {
    private String teamName;
    private List<Long> userIds;

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }
}
