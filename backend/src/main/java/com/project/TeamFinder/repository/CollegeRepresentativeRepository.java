package com.project.TeamFinder.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.CollegeRepresentative;

@Repository
public interface CollegeRepresentativeRepository extends CrudRepository<CollegeRepresentative, Long> {
    
    Boolean existsByEmail(String email);
    Optional<String> findCollegeByEmail(String email);
}
