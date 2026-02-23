package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.UserInterestedInTeam;

import jakarta.transaction.Transactional;

@Repository
public interface UserInterestedInTeamRepository extends CrudRepository<UserInterestedInTeam, Long> {

    @Query(value = "SELECT COUNT(*) > 0 FROM user_interested_in_teams WHERE user_id = :userId AND team_id = :teamId", nativeQuery = true)
    boolean existsByUserIdAndTeamId(@Param("userId") Long userId, @Param("teamId") Long teamId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO user_interested_in_teams (user_id, team_id) VALUES (:userId, :teamId)", nativeQuery = true)
    void addUserInterestedInTeam(@Param("teamId") Long teamId, @Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_interested_in_teams WHERE team_id = :teamId AND user_id = :userId", nativeQuery = true)
    void removeUserInterestedInTeam(@Param("teamId") Long eventId, @Param("userId") Long userId);

    @Query(value = "SELECT team_id FROM user_interested_in_teams WHERE user_id = :userId", nativeQuery = true)
    List<Long> findInterestedTeamIdbyUserId(@Param("userId") Long userId);

    @Query(value = "SELECT team_id, user_id FROM user_interested_in_teams WHERE team_id IN (:teamIds)", nativeQuery = true)
    List<Object[]> findRequestsByTeamIds(@Param("teamIds") List<Long> teamIds);

    @Query(value = """
                SELECT t.id
                FROM teams t
                WHERE t.id IN (
                    SELECT uit.team_id
                    FROM user_interested_in_teams uit
                    WHERE uit.user_id = :userId
                )
                AND t.event_id = :eventId
            """, nativeQuery = true)
    List<Number> findInterestedTeamIdsByUserAndEvent(
            @Param("userId") Long userId,
            @Param("eventId") Long eventId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE user_interested_in_teams SET team_id = :toTeamId WHERE team_id = :fromTeamId", nativeQuery = true)
    void moveRequestsToAnotherTeam(@Param("fromTeamId") Long fromTeamId, @Param("toTeamId") Long toTeamId);
}
