package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.College;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long>{

    Long findIdByName(String name);

    List<College> findByNameContainingIgnoreCase(String name);
}
