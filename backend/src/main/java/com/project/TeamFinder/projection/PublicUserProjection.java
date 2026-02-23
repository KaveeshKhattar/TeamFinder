package com.project.TeamFinder.projection;

import java.util.List;

public interface PublicUserProjection {
    Long getId();
    String getFirstName();
    String getLastName();
    String getPictureURL();
    String getBio();
    List<String> getSkills();
    String getPreferredRole();
}
