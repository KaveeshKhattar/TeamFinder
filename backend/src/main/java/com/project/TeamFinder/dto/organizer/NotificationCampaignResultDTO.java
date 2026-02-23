package com.project.TeamFinder.dto.organizer;

import java.util.ArrayList;
import java.util.List;

public class NotificationCampaignResultDTO {
    private int recipients;
    private int sent;
    private List<String> errors = new ArrayList<>();

    public int getRecipients() {
        return recipients;
    }

    public void setRecipients(int recipients) {
        this.recipients = recipients;
    }

    public int getSent() {
        return sent;
    }

    public void setSent(int sent) {
        this.sent = sent;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public void addError(String error) {
        this.errors.add(error);
    }
}
