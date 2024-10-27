package com.project.TeamFinder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="college_representatives")
public class CollegeRepresentative {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)    
    private Long id;

    @Column(unique = true, nullable = false, name="college_id")
    private Long collegeId;

    @Column(unique = true, nullable = false)
    private String email;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCollege_id() {
        return collegeId;
    }

    public void setCollege_id(Long college_id) {
        this.collegeId = college_id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
