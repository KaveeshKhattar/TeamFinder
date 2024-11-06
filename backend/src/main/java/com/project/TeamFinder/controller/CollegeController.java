package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
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

    public CollegeController(JwtService jwtService, CollegeService collegeService) {
        this.jwtService = jwtService;
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
        System.out.println("Colleges: " + colleges);
        return ResponseEntity.ok(colleges);
    }

    @GetMapping("/colleges/searchColleges")    
    public ResponseEntity<?> getFilteredColleges(@RequestHeader("Authorization") String token, @RequestParam String name) {

        List<College> filteredColleges = collegeService.searchColleges(name);
        return ResponseEntity.ok(filteredColleges);
            
    }
    
}
