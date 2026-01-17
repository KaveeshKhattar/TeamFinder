package com.project.TeamFinder.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.EventUser;

import jakarta.transaction.Transactional;

import java.util.List;


@Repository
public interface EventUserRepository extends CrudRepository<EventUser, Long>{
    List<EventUser> findByEventId(Long eventId);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM events_interested_users WHERE event_id = :eventId AND user_id = :id", nativeQuery = true)
    boolean existsByEventIdAndId(@Param("eventId") Long eventId, @Param("id") Long id);

    @Modifying
    @Transactional
    @Query(value = "SELECT user_id FROM events_interested_users WHERE event_id = :eventId", nativeQuery = true)
    List<Long> findUserIdsOfAlreadyInterestedUsers(@Param("eventId") Long eventId);

    @Modifying
    @Transactional
    @Query(value = "SELECT event_id FROM events_interested_users WHERE user_id = :userId", nativeQuery = true)
    List<Long> findInterestedEventIDsPerUser(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO events_interested_users (event_id, user_id) VALUES (:eventId, :id)", nativeQuery = true)
    void addInterestedUserToEvent(@Param("eventId") Long eventId, @Param("id") Long id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM events_interested_users WHERE event_id = :eventId AND user_id = :id", nativeQuery = true)
    void removeInterestedUserFromEvent(@Param("eventId") Long eventId, @Param("id") Long id);
}
