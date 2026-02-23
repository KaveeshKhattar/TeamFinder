package com.project.TeamFinder.dto.organizer;

public class OrganizerAccessUpdateRequestDTO {
    private Long eventId;
    private String userEmail;

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
