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
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin
public class CollegeController {
    private final CollegeService collegeService;

    public CollegeController(CollegeService collegeService) {
        this.collegeService = collegeService;
    }

    @GetMapping("/colleges")
    public ResponseEntity<List<College>> allColleges() {
        List<College> colleges = collegeService.findAllColleges();
        return ResponseEntity.ok(colleges);
    }

    @RequestMapping(method = RequestMethod.OPTIONS, value = "/colleges")
    public ResponseEntity<?> handleOptionsRequest() {
        return ResponseEntity.ok().build(); // Respond with 200 OK to OPTIONS requests
    }

    @GetMapping("/colleges/searchColleges")
    public List<College> getFilteredColleges(@RequestHeader("Authorization") String token, @RequestParam String name) {
        System.out.println("Called college search controller with name: " + name);
        List<College> filteredColleges = collegeService.searchColleges(name);
        return filteredColleges;
    }
    
}
