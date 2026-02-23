package com.project.TeamFinder.service;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminAccessService {
    private final Set<String> adminEmails;

    public AdminAccessService(@Value("${app.admin.emails:}") String adminEmailsValue) {
        this.adminEmails = Arrays.stream(adminEmailsValue.split(","))
                .map(String::trim)
                .filter(email -> !email.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    public boolean isAdmin(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        return adminEmails.contains(email.trim().toLowerCase());
    }

    public void requireAdmin(String email) {
        if (!isAdmin(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }
}
