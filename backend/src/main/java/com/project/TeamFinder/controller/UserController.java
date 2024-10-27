package com.project.TeamFinder.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.UpdateUserDTO;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.service.JwtService;
import com.project.TeamFinder.service.UserService;

import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;



@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    
    private final UserService userService;
    
    private JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List <User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Optional<User>> profile(@RequestHeader("Authorization") String token) {

        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        Optional<User> profile = userService.findByEmail(userEmail);
        
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestHeader("Authorization") String token, @RequestBody UpdateUserDTO updateUserDTO) {

        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        User updatedUser = userService.updateUser(userEmail, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }
    
    @GetMapping("/searchUsersByFullName")
    public List<User> getUsersByFirstName(@RequestHeader("Authorization") String token, @RequestParam String name) {
        List<User> filteredUsers = userService.getUsersByFullName(name);
        return filteredUsers;
    }
    
    @GetMapping("/checkIfRep")
    public Boolean getIfRep(@RequestHeader("Authorization") String token, @RequestParam("collegeId") Long collegeId) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);

        Optional<User> profile = userService.findByEmail(userEmail);
        User profileReal = profile.orElseThrow(() -> new RuntimeException("Team not found"));

        Boolean ans = userService.getIfRep(profileReal.getEmail(), collegeId);
        return ans;
    }

    @GetMapping("/checkIfRepProfile")
    public Boolean getIfRepNoCollegeId(@RequestHeader("Authorization") String token) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        Boolean ans = userService.getIfRepReal(userEmail);
        return ans;
    }
}
