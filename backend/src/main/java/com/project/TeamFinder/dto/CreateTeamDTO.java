package com.project.TeamFinder.dto;

import java.util.List;

import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.projection.UserProjection;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTeamDTO {
    private String teamName;
    private List<UserProjection> members;

    public CreateTeamDTO(Team team, List<UserProjection> members) {
        this.teamName = team.getName();
        this.members = members;
    }
}
