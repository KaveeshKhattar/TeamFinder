package com.project.TeamFinder.dto;

import java.time.OffsetDateTime;

public class EventRequestDTO {
    // private Long collegeId;
    private String eventName;
    // private String eventDate;
    // private String eventTime;
    private OffsetDateTime eventTime;
    private String eventVenue; // Adjust type if needed
    private Long size;
    // private String eventDescription;

    public Long getTeamSize() {
        return size;
    }

    public void setTeamSize(Long size) {
        this.size = size;
    }

    // public String getEventDescription() {
    //     return eventDescription;
    // }

    // public void setEventDescription(String eventDescription) {
    //     this.eventDescription = eventDescription;
    // }

    // Getters and Setters

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
