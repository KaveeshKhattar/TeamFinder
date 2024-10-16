package com.project.TeamFinder.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.College;

@Repository
public interface CollegeRepository extends CrudRepository<College, Long>{
        
    List<College> findAll();
}
