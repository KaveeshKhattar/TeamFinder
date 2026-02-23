package com.project.TeamFinder.dto;

import java.time.OffsetDateTime;

public class EventRequestDTO {
    private String eventName;
    private OffsetDateTime eventTime;
    private String eventVenue;
    private Long size;

    public Long getTeamSize() {
        return size;
    }

    public void setTeamSize(Long size) {
        this.size = size;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public OffsetDateTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(OffsetDateTime eventTime) {
        this.eventTime = eventTime;
    }

    public String getEventVenue() {
        return eventVenue;
    }

    public void setEventVenue(String eventVenue) {
        this.eventVenue = eventVenue;
    }
}
