package com.project.TeamFinder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.dto.MemberDTO;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.projection.UserProjection;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verification_code);
    Boolean existsByEmailContainingIgnoreCase(String email);
    List<UserProjection> findAllByIdIn(List<Long> userIds);
    List<User> findByFullNameContainingIgnoreCase(String firstName);
}