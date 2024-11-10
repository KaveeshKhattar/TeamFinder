package com.project.TeamFinder.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.UpdateUserDTO;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.repository.CollegeRepresentativeRepository;
import com.project.TeamFinder.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final CollegeRepresentativeRepository collegeRepresentativeRepository;
    
    public UserService(UserRepository userRepository, EmailService emailService, CollegeRepresentativeRepository collegeRepresentativeRepository) {
        this.userRepository = userRepository;
        this.collegeRepresentativeRepository = collegeRepresentativeRepository;
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

        user.setFirstName(updateUserDTO.getFirstName());
        user.setLastName(updateUserDTO.getLastName());
        user.setEmail(updateUserDTO.getEmail());
        return userRepository.save(user);
    }

    public List<User> getUsersByFullName(String firstNameSearch) {
        List<User> searchResults = userRepository.findByFullNameContainingIgnoreCase(firstNameSearch);
        return searchResults;
    }

    public Boolean isUserCollegeRepresentative(String email, Long collegeId) {
        Optional<Long> collegeNameOpt = collegeRepresentativeRepository.findByEmailAndCollege(email, collegeId);
        if (collegeNameOpt.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    public void saveFileURL(String userEmail, String fileURL) {
        userRepository.addPictureURL(userEmail, fileURL);
    }

    public void deleteFileURL(String userEmail) {
        userRepository.removePictureURL(userEmail);
    }

}
