package com.project.TeamFinder.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {
    private String firstName;
    private String lastName;

    @Override
    public String toString() {
        return "UpdateUserDTO{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }
}
