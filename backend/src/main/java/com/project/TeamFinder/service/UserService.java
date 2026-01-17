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

    public void addToWaitlist(String email) {
        System.out.println("Service layer adding to waitlist: " + email);
        userRepository.addToWaitlist(email);
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

        System.out.println("Updating user in service layer: " + email);
        
        Optional<User> optionalUser = userRepository.findByEmail(email);
        
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(updateUserDTO.getFirstName());
        user.setLastName(updateUserDTO.getLastName());  
        user.setEmail(updateUserDTO.getEmail());
        user.setBio(updateUserDTO.getBio());
        user.setSkills(updateUserDTO.getSkills());
        return userRepository.save(user);
    }

    // public List<User> getUsersByFullName(String firstNameSearch) {
    //     List<User> searchResults = userRepository.findByFullNameContainingIgnoreCase(firstNameSearch);
    //     return searchResults;
    // }

    public Boolean isUserCollegeRepresentative(String email, Long collegeId) {
        Optional<Long> collegeNameOpt = collegeRepresentativeRepository.findByEmailAndCollege(email, collegeId);
        if (collegeNameOpt.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    public void saveFileURL(String userEmail, String fileURL) {
        System.out.println("Saving file URL to database: " + fileURL + " for user: " + userEmail);
        userRepository.addPictureURL(userEmail, fileURL);
    }

    public void deleteFileURL(String userEmail) {
        System.out.println("Deleting file URL from database for user: " + userEmail);
        userRepository.removePictureURL(userEmail);
    }

}
