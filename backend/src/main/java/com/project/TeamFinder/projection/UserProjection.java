package com.project.TeamFinder.projection;

public interface UserProjection {
    Long getId();    
    String getFirstName();
    String getLastName();
    String getEmail();
    String getPictureURL();
    String getBio();
    String[] getSkills();
}
