package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.TeamMembers;

@Repository
public interface TeamMembersRepository extends CrudRepository<TeamMembers, Long> {
    List<TeamMembers> findByTeamId(Long teamId);
}
