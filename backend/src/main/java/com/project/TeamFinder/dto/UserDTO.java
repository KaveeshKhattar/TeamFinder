package com.project.TeamFinder.dto;

import java.util.List;

public class UserDTO {
    private Long id;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private List<String> skills;
    private String pictureURL;
    private String preferredRole;
    
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }
    public List<String> getSkills() {
        return skills;
    }
    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
    public String getPictureURL() {
        return pictureURL;
    }
    public void setPictureURL(String pictureURL) {
        this.pictureURL = pictureURL;
    }
    public String getPreferredRole() {
        return preferredRole;
    }
    public void setPreferredRole(String preferredRole) {
        this.preferredRole = preferredRole;
    }

    // No-argument constructor
    public UserDTO() {
    }

    // All-arguments constructor
    public UserDTO(Long id, String email, String firstName, String lastName, String bio, List<String> skills, String pictureURL, String preferredRole) {
        this.id  = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.skills = skills;
        this.pictureURL = pictureURL;
        this.preferredRole = preferredRole;
    }
    
    public String toString() {
        return "UserDTO{" +
        "id='" + id + '\'' +
                "email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", bio='" + bio + '\'' +
                ", skills=" + skills +
                ", pictureURL='" + pictureURL + '\'' +
                ", preferredRole='" + preferredRole + '\'' +
                '}';
    }
}
