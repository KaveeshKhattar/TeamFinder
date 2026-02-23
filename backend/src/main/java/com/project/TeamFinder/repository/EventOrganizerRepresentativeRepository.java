package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.EventOrganizerRepresentative;

@Repository
public interface EventOrganizerRepresentativeRepository extends JpaRepository<EventOrganizerRepresentative, Long> {
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
    boolean existsByUserId(Long userId);
    long deleteByEventIdAndUserId(Long eventId, Long userId);
    List<EventOrganizerRepresentative> findByEventId(Long eventId);
}
