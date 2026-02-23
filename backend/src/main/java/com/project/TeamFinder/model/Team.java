package com.project.TeamFinder.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="teams")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String name;

    @Column(name="event_id")
    private long eventId;

    @Column(name = "roles_looking_for")
    private String rolesLookingFor;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getEventId() {
        return eventId;
    }

    public void setEventId(long eventId) {
        this.eventId = eventId;
    }

    public String getRolesLookingFor() {
        return rolesLookingFor;
    }

    public void setRolesLookingFor(String rolesLookingFor) {
        this.rolesLookingFor = rolesLookingFor;
    }

    @Override 
    public String toString() {
        return "Team Name: " + name + " Event ID: " + eventId;
    }
}
