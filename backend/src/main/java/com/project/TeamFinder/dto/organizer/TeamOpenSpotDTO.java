package com.project.TeamFinder.dto.organizer;

public class TeamOpenSpotDTO {
    private Long teamId;
    private String teamName;
    private int memberCount;
    private int openSpots;

    public TeamOpenSpotDTO(Long teamId, String teamName, int memberCount, int openSpots) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.memberCount = memberCount;
        this.openSpots = openSpots;
    }

    public Long getTeamId() {
        return teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public int getOpenSpots() {
        return openSpots;
    }
}
