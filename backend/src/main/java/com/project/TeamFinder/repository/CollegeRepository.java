package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.College;

@Repository
public interface CollegeRepository extends CrudRepository<College, Long>{
    
    @Override
    List<College> findAll();

    Long findIdByName(String name);

    List<College> findByNameContainingIgnoreCase(String name);
}
