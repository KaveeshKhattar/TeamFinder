package com.project.TeamFinder.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.CollegeRepresentative;

import jakarta.transaction.Transactional;

@Repository
public interface CollegeRepresentativeRepository extends CrudRepository<CollegeRepresentative, Long> {
    
    Boolean existsByEmail(String email);
    Optional<String> findCollegeByEmail(String email);

    
    @Transactional
    @Query(value = "SELECT college_id FROM college_representatives WHERE college_id = :collegeId and email = :email", nativeQuery = true)
    Optional<Long> findByEmailAndCollege(String email, Long collegeId);
    
}
