package com.project.TeamFinder.dto.organizer;

import java.util.List;

public class SuggestedMatchDTO {
    private Long userId;
    private String userEmail;
    private String userName;
    private String userPreferredRole;
    private List<String> userSkills;
    private Long teamId;
    private String teamName;
    private Integer teamOpenSlots;
    private List<String> teamRolesLookingFor;
    private int score;
    private List<String> reasons;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPreferredRole() {
        return userPreferredRole;
    }

    public void setUserPreferredRole(String userPreferredRole) {
        this.userPreferredRole = userPreferredRole;
    }

    public List<String> getUserSkills() {
        return userSkills;
    }

    public void setUserSkills(List<String> userSkills) {
        this.userSkills = userSkills;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Integer getTeamOpenSlots() {
        return teamOpenSlots;
    }

    public void setTeamOpenSlots(Integer teamOpenSlots) {
        this.teamOpenSlots = teamOpenSlots;
    }

    public List<String> getTeamRolesLookingFor() {
        return teamRolesLookingFor;
    }

    public void setTeamRolesLookingFor(List<String> teamRolesLookingFor) {
        this.teamRolesLookingFor = teamRolesLookingFor;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}
