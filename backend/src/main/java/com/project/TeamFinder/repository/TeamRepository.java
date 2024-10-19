package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.Team;

@Repository
public interface TeamRepository extends CrudRepository<Team, Long> {
    List<Team> findByEventId(Long id);
}
