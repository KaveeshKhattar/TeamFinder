package com.project.TeamFinder.repository;

import java.util.List;

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

    @Modifying
    @Transactional
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM team_members WHERE team_id = :teamId AND user_id = :userId", nativeQuery = true)
    boolean existsByTeamIdAndUserId(@Param("teamId") Long teamId, @Param("userId") Long userId);

    // Optional: If you want to remove users by a list of user IDs
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM team_members WHERE team_id = ?1", nativeQuery = true)
    void deleteUsersFromTeamByIds(Long teamId, List<Long> userIds);
    
}
