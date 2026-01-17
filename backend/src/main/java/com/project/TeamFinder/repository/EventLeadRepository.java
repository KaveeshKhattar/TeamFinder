package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.Lead;

import jakarta.transaction.Transactional;

@Repository
public interface EventLeadRepository extends CrudRepository<Lead, Long> {
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM match WHERE event_id = :eventId AND user_1 = :userId1 AND user_2 = :userId2", nativeQuery = true)
    boolean existsByEventIdAndUserId1AndUserId2(@Param("eventId") Long eventId, @Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO match (event_id, user_1, user_2) VALUES (:eventId, :userId1, :userId2)", nativeQuery = true)
    void addLeadToEvent(@Param("eventId") Long eventId, @Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM match WHERE event_id = :eventId AND user_1 = :userId1 AND user_2 = :userId2", nativeQuery = true)
    void removeLeadFromEvent(@Param("eventId") Long eventId, @Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query(value = "SELECT user_2 FROM match WHERE event_id = :eventId AND user_1 = :userId1", nativeQuery = true)
    List<Long> findUserIdsByEventIdAndUserId1(@Param("eventId") Long eventId, @Param("userId1") Long userId1);
}
