package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.TeamMembers;

@Repository
public interface TeamMembersRepository extends CrudRepository<TeamMembers, Long> {
    List<TeamMembers> findByTeamId(Long teamId);
    
    @Query(value = "SELECT team_id FROM team_members WHERE user_id = :userId", nativeQuery = true)
    List<Long> findTeamIdByUserId(@Param("userId") Long userId);

    @Query(value = "DELETE FROM team_members WHERE team_id = :id", nativeQuery = true)
    void deleteMembers(@Param("id") Long id);
    
}
