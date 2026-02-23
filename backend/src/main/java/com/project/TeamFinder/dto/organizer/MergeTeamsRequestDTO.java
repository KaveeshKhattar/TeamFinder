package com.project.TeamFinder.dto.organizer;

public class MergeTeamsRequestDTO {
    private Long fromTeamId;
    private Long toTeamId;

    public Long getFromTeamId() {
        return fromTeamId;
    }

    public void setFromTeamId(Long fromTeamId) {
        this.fromTeamId = fromTeamId;
    }

    public Long getToTeamId() {
        return toTeamId;
    }

    public void setToTeamId(Long toTeamId) {
        this.toTeamId = toTeamId;
    }
}
