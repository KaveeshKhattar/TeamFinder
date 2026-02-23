package com.project.TeamFinder.dto.organizer;

public class NotificationCampaignRequestDTO {
    private String subject;
    private String message;
    private Integer daysBeforeDeadline;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getDaysBeforeDeadline() {
        return daysBeforeDeadline;
    }

    public void setDaysBeforeDeadline(Integer daysBeforeDeadline) {
        this.daysBeforeDeadline = daysBeforeDeadline;
    }
}
