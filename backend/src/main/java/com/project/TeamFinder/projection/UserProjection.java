package com.project.TeamFinder.projection;

import java.util.List;

public interface UserProjection {
    Long getId();    
    String getFirstName();
    String getLastName();
    String getEmail();
    String getPictureURL();
    String getBio();
    List<String> getSkills();
    String getPreferredRole();
}
