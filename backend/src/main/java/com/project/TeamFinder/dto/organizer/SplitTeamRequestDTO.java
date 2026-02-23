package com.project.TeamFinder.dto.organizer;

import java.util.List;

public class SplitTeamRequestDTO {
    private String newTeamName;
    private List<Long> userIdsToMove;

    public String getNewTeamName() {
        return newTeamName;
    }

    public void setNewTeamName(String newTeamName) {
        this.newTeamName = newTeamName;
    }

    public List<Long> getUserIdsToMove() {
        return userIdsToMove;
    }

    public void setUserIdsToMove(List<Long> userIdsToMove) {
        this.userIdsToMove = userIdsToMove;
    }
}
