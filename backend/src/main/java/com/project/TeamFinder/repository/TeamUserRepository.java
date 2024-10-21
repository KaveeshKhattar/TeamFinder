package com.project.TeamFinder.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.TeamUser;

import jakarta.transaction.Transactional;

@Repository
public interface TeamUserRepository extends CrudRepository<TeamUser, Long> {
    
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO team_members (team_id, user_id) VALUES (:teamId, :userId)", nativeQuery = true)
    void addUserToTeam(@Param("teamId") Long teamId, @Param("userId") Long userId);
    
}
