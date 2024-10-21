package com.project.TeamFinder.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.UpdateUserDTO;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    public Optional<User> findByEmail(String email) {
        Optional<User> profile = userRepository.findByEmail(email);
        return profile;
    }

    @Transactional
    public User updateUser(String email, UpdateUserDTO updateUserDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));

        // Update only the fields that have changed
        if (updateUserDTO.getFirstName() != null) {
            user.setFirstName(updateUserDTO.getFirstName());
        }
        if (updateUserDTO.getLastName() != null) {
            user.setLastName(updateUserDTO.getLastName());
        }
        return userRepository.save(user);        
    }

    @Transactional
    public List<User> getUsersByFullName(String firstNameSearch) {
        List<User> searchResults = userRepository.findByFullNameContainingIgnoreCase(firstNameSearch);
        return searchResults;
    }

}
