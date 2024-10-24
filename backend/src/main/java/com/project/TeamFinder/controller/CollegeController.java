package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.model.College;
import com.project.TeamFinder.service.CollegeService;
import com.project.TeamFinder.service.JwtService;

import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class CollegeController {
    
    JwtService jwtService;

    private final CollegeService collegeService;
    private final UserDetailsService userDetailsService;

    public CollegeController(JwtService jwtService, UserDetailsService userDetailsService, CollegeService collegeService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.collegeService = collegeService;
    }

    // Respond with 200 OK to OPTIONS requests
    @RequestMapping(method = RequestMethod.OPTIONS, value = "/colleges")
    public ResponseEntity<?> handleOptionsRequest() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/colleges")
    public ResponseEntity<List<College>> allColleges() {
        List<College> colleges = collegeService.findAllColleges();
        return ResponseEntity.ok(colleges);
    }

    @GetMapping("/colleges/searchColleges")
    public ResponseEntity<?> getFilteredColleges(@RequestHeader("Authorization") String token, @RequestParam String name) {


        final String userEmail = jwtService.extractUsername(token);
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

        if (userEmail != null) {
            if (jwtService.isTokenValid(token, userDetails)) {
                List<College> filteredColleges = collegeService.searchColleges(name);
                return ResponseEntity.ok(filteredColleges);
            } else {
                // Return error for invalid token
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid sign in token");
            }
        } else {
            // Return error if the user is not found in token
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
    }
    
}
