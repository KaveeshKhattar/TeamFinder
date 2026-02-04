package com.project.TeamFinder.dto.auth;

public class PasswordChangeDTO {
    private String email;
    private String password;

    // Getter and Setter methods
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
