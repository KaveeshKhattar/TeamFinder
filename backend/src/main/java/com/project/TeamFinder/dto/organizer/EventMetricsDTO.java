package com.project.TeamFinder.dto.organizer;

import java.util.List;

public class EventMetricsDTO {
    private Long eventId;
    private long unmatchedParticipants;
    private long matchedParticipants;
    private long matchesMade;
    private long dropOffCount;
    private double dropOffRate;
    private Double averageTimeToMatchHours;
    private String timeToMatchNote;
    private List<TeamOpenSpotDTO> openSpotsByTeam;

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public long getUnmatchedParticipants() {
        return unmatchedParticipants;
    }

    public void setUnmatchedParticipants(long unmatchedParticipants) {
        this.unmatchedParticipants = unmatchedParticipants;
    }

    public long getMatchedParticipants() {
        return matchedParticipants;
    }

    public void setMatchedParticipants(long matchedParticipants) {
        this.matchedParticipants = matchedParticipants;
    }

    public long getMatchesMade() {
        return matchesMade;
    }

    public void setMatchesMade(long matchesMade) {
        this.matchesMade = matchesMade;
    }

    public long getDropOffCount() {
        return dropOffCount;
    }

    public void setDropOffCount(long dropOffCount) {
        this.dropOffCount = dropOffCount;
    }

    public double getDropOffRate() {
        return dropOffRate;
    }

    public void setDropOffRate(double dropOffRate) {
        this.dropOffRate = dropOffRate;
    }

    public Double getAverageTimeToMatchHours() {
        return averageTimeToMatchHours;
    }

    public void setAverageTimeToMatchHours(Double averageTimeToMatchHours) {
        this.averageTimeToMatchHours = averageTimeToMatchHours;
    }

    public String getTimeToMatchNote() {
        return timeToMatchNote;
    }

    public void setTimeToMatchNote(String timeToMatchNote) {
        this.timeToMatchNote = timeToMatchNote;
    }

    public List<TeamOpenSpotDTO> getOpenSpotsByTeam() {
        return openSpotsByTeam;
    }

    public void setOpenSpotsByTeam(List<TeamOpenSpotDTO> openSpotsByTeam) {
        this.openSpotsByTeam = openSpotsByTeam;
    }
}
