package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.model.College;
import com.project.TeamFinder.service.CollegeService;

@RestController
@CrossOrigin
public class CollegeController {
    private final CollegeService collegeService;

    public CollegeController(CollegeService collegeService) {
        this.collegeService = collegeService;
    }

    @GetMapping("/home")
    public ResponseEntity<List<College>> allColleges() {
        List<College> colleges = collegeService.findAllColleges();
        return ResponseEntity.ok(colleges);
    }

    @RequestMapping(method = RequestMethod.OPTIONS, value = "/home")
    public ResponseEntity<?> handleOptionsRequest() {
        return ResponseEntity.ok().build(); // Respond with 200 OK to OPTIONS requests
    }
}
