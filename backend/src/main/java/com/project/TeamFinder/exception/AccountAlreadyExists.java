package com.project.TeamFinder.exception;

public class AccountAlreadyExists extends RuntimeException {
    public AccountAlreadyExists(String message) {
        super(message);
    }
}
