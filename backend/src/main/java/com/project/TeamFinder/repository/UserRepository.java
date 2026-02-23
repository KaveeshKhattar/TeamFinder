package com.project.TeamFinder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.project.TeamFinder.model.User;
import com.project.TeamFinder.projection.UserProjection;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmailContainingIgnoreCase(String email);

    List<UserProjection> findAllByIdIn(List<Long> userIds);
    List<User> findAllByEmailIn(List<String> emails);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO waitlist (email) VALUES (:email)", nativeQuery = true)
    void addToWaitlist(String email);

    @Query("SELECT u.id AS id, u.email AS email, u.firstName AS firstName, u.lastName AS lastName, u.bio as bio, u.skills as skills, u.pictureURL as pictureURL FROM User u")
    List<UserProjection> findAllUsers();

}
