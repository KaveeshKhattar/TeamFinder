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
@Table(name="events_interested_users")
public class EventUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="event_id")
    private Long eventId;

    @Column(name="user_id")
    private Long userId;

    @Override
    public String toString() {
        return "UpdateUserDTO{" +
                "eventId='" + eventId + '\'' +
                ", userId='" + userId + '\'' +
                '}';
    }
}
