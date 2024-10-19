package com.project.TeamFinder.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberDTO {
    public MemberDTO(String email, String firstName, String lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    private String email;
    private String firstName;
    private String lastName;

    public String toString() {
        return "MemberDTO{" + 
        "email=" + email +
        ", firstName='" + firstName + '\'' +
        ", lastName='" + lastName + '\'' + '}';
    }
}
