package com.project.TeamFinder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.Team;

import jakarta.transaction.Transactional;

@Repository
public interface TeamRepository extends CrudRepository<Team, Long> {
    List<Team> findByEventId(Long id);
    Optional<Team> findById(long id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE teams SET name = :name WHERE id = :id", nativeQuery = true)
    void updateTeamNameById(Long id, String name);
}
