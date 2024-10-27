package com.project.TeamFinder.dto;

public class EventRequestDTO {
    private Long collegeId;
    private String eventName;
    private String eventDate;
    private String eventTime;
    private String eventVenue; // Adjust type if needed
    private Long teamSize;
    private String eventDescription;

    public Long getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Long teamSize) {
        this.teamSize = teamSize;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    // Getters and Setters
    public Long getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(Long collegeId) {
        this.collegeId = collegeId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getEventVenue() {
        return eventVenue;
    }

    public void setEventVenue(String eventVenue) {
        this.eventVenue = eventVenue;
    }
}
