package com.project.TeamFinder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.project.TeamFinder.model.User;
import com.project.TeamFinder.projection.UserProjection;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verification_code);
    Boolean existsByEmailContainingIgnoreCase(String email);
    List<UserProjection> findAllByIdIn(List<Long> userIds);
    // List<User> findByFullNameContainingIgnoreCase(String firstName);

    
    @Modifying
    @Transactional
    @Query(value="INSERT INTO waitlist (email) VALUES (:email)", nativeQuery = true)
    void addToWaitlist(String email);

    @Modifying
    @Transactional
    @Query(value="UPDATE users SET picture_url = :url WHERE email = :user_email", nativeQuery = true)
    void addPictureURL(String user_email, String url);

    @Modifying
    @Transactional
    @Query(value="UPDATE users SET picture_url = NULL WHERE email = :user_email", nativeQuery = true)
    void removePictureURL(String user_email);


}