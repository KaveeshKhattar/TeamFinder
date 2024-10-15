package com.project.TeamFinder.dto;

import com.project.TeamFinder.model.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String username;
    private Role role;
}
