package com.project.TeamFinder.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.UserDTO;
import com.project.TeamFinder.dto.auth.UpdateUserDTO;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.projection.PublicUserProjection;
import com.project.TeamFinder.projection.UserProjection;
import com.project.TeamFinder.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }

    public void addToWaitlist(String email) {
        userRepository.addToWaitlist(email);
    }

    public List<UserProjection> getAllUsers() {
        return userRepository.findAllUsers();
    }

    public List<PublicUserProjection> getAllPublicUsers() {
        return userRepository.findAllPublicUsers();
    }

    public UserDTO getProfile(String email) {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getBio(),
            user.getSkills(),
            user.getPictureURL(),
            user.getPreferredRole()
        );
    }

    
    @Transactional
    public User updateUser(String email, UpdateUserDTO updateUserDTO) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(updateUserDTO.getFirstName());
        user.setLastName(updateUserDTO.getLastName());
        user.setEmail(updateUserDTO.getEmail());
        user.setBio(updateUserDTO.getBio());
        user.setSkills(updateUserDTO.getSkills());
        user.setPreferredRole(updateUserDTO.getPreferredRole());
        return userRepository.save(user);
    }

    public void saveFileURL(String userEmail, String fileURL) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPictureURL(fileURL);
    }

    public void deleteFileURL(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPictureURL(null);
    }

}
