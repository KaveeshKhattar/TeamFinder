package com.project.TeamFinder.dto.organizer;

import java.util.List;

public class UpdateTeamOrganizerRequestDTO {
    private String teamName;
    private List<Long> userIds;
    private List<String> rolesLookingFor;

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

    public List<String> getRolesLookingFor() {
        return rolesLookingFor;
    }

    public void setRolesLookingFor(List<String> rolesLookingFor) {
        this.rolesLookingFor = rolesLookingFor;
    }
}
