package com.project.TeamFinder.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeamUserRequestDTO {
    private Long teamId;
    private List<Long> userIds;

    @Override
    public String toString() {
        return "Team ID: " + teamId + " List of users: " + userIds;
    }
}
