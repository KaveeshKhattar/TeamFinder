package com.project.TeamFinder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="team_members")
public class TeamUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;  
    
    @Column(name="team_id")
    private long teamId;

    @Column(name="user_id")
    private long userId;
}
