package com.project.TeamFinder.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.model.College;
import com.project.TeamFinder.repository.CollegeRepository;

@Service
public class CollegeService {

    private final CollegeRepository collegeRepository;

    public CollegeService(CollegeRepository collegeRepository) {
        this.collegeRepository = collegeRepository;
    }
    
    public List<College> findAllColleges() {
        return collegeRepository.findAll();
    }

    public Long findIdByCollegeName(String name) {
        return collegeRepository.findIdByName(name);
    }

}