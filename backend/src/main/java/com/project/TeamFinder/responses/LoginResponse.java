package com.project.TeamFinder.responses;


public class LoginResponse {
    private String token;
    private long expiresIn;
    private String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public LoginResponse(String jwtToken, long expirationTime, String role) {
        this.token = jwtToken;
        this.expiresIn = expirationTime;
        this.role = role;  // Initialize role
    }
}
