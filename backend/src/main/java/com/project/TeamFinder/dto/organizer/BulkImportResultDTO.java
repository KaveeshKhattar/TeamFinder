package com.project.TeamFinder.dto.organizer;

import java.util.ArrayList;
import java.util.List;

public class BulkImportResultDTO {
    private int processedRows;
    private int createdTeams;
    private int addedParticipants;
    private int addedMemberships;
    private int skippedRows;
    private final List<String> errors = new ArrayList<>();

    public int getProcessedRows() {
        return processedRows;
    }

    public void setProcessedRows(int processedRows) {
        this.processedRows = processedRows;
    }

    public int getCreatedTeams() {
        return createdTeams;
    }

    public void setCreatedTeams(int createdTeams) {
        this.createdTeams = createdTeams;
    }

    public int getAddedParticipants() {
        return addedParticipants;
    }

    public void setAddedParticipants(int addedParticipants) {
        this.addedParticipants = addedParticipants;
    }

    public int getAddedMemberships() {
        return addedMemberships;
    }

    public void setAddedMemberships(int addedMemberships) {
        this.addedMemberships = addedMemberships;
    }

    public int getSkippedRows() {
        return skippedRows;
    }

    public void setSkippedRows(int skippedRows) {
        this.skippedRows = skippedRows;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void addError(String error) {
        this.errors.add(error);
    }
}
