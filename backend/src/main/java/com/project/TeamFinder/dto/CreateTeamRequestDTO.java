package com.project.TeamFinder.dto;

import java.util.List;

public class CreateTeamRequestDTO {
    private String teamName;
    private List<Long> userIds;
    private Long eventId;
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
    public Long getEventId() {
        return eventId;
    }
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public List<String> getRolesLookingFor() {
        return rolesLookingFor;
    }

    public void setRolesLookingFor(List<String> rolesLookingFor) {
        this.rolesLookingFor = rolesLookingFor;
    }


}
