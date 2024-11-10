package com.project.TeamFinder.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.exception.NoCollegesException;
import com.project.TeamFinder.model.College;
import com.project.TeamFinder.repository.CollegeRepository;

@Service
public class CollegeService {

    private final CollegeRepository collegeRepository;

    public CollegeService(CollegeRepository collegeRepository) {
        this.collegeRepository = collegeRepository;
    }

    public List<College> findAllColleges() {
        List<College> colleges = collegeRepository.findAll();
        if (colleges.isEmpty()) {
            throw new NoCollegesException("Error fetching colleges.");
        }
        return collegeRepository.findAll();
    }

    public List<College> searchColleges(String name) {
        List<College> searchResults = collegeRepository.findByNameContainingIgnoreCase(name);
        if (searchResults.isEmpty()) {
            throw new NoCollegesException("Error searching colleges.");
        }
        return searchResults;
    }

}