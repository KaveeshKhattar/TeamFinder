package com.project.TeamFinder.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.repository.CollegeRepresentativeRepository;

@Service
public class CollegeRepresentativeService {
    private final CollegeRepresentativeRepository collegeRepresentativeRepository;

    public CollegeRepresentativeService(CollegeRepresentativeRepository collegeRepresentativeRepository) {
        this.collegeRepresentativeRepository = collegeRepresentativeRepository;
    }

    public Optional<String> findCollegeByEmail(String email) {
        return collegeRepresentativeRepository.findCollegeByEmail(email);
    }
}
