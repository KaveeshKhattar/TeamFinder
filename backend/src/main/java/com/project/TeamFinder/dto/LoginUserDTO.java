package com.project.TeamFinder.dto;

import com.project.TeamFinder.model.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginUserDTO {
    private String email;
    private String password;
    private Role role;
}