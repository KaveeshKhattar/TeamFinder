package com.project.TeamFinder.UnitTesting;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.project.TeamFinder.model.College;
import com.project.TeamFinder.repository.CollegeRepository;
import com.project.TeamFinder.service.CollegeService;

import java.util.List;
import java.util.Arrays;

public class CollegeServiceTest {

    @Mock
    private CollegeRepository collegeRepository;

    @InjectMocks
    private CollegeService collegeService;

    @BeforeEach
    public void setup() {
        System.out.println("Initializing mocks...");
        MockitoAnnotations.openMocks(this);  // Initialize mock objects
        assertNotNull(collegeRepository); 
    }

    @Test
    public void testFindAllColleges() {
        System.out.println("Running testFindAllColleges...");
        College college1 = new College(1L, "College A", "Bangalore");
        College college2 = new College(2L, "College B", "Bangalore");
        List<College> expectedColleges = Arrays.asList(college1, college2);

        when(collegeRepository.findAll()).thenReturn(expectedColleges);

        List<College> actualColleges = collegeService.findAllColleges();

        assertNotNull(actualColleges);
        assertEquals(2, actualColleges.size());
        assertEquals(expectedColleges, actualColleges);
    }

    @Test
    public void testSearchColleges() {
        String searchTerm = "College";
        College college1 = new College(1L, "College A", "Bangalore");
        College college2 = new College(2L, "College B", "Bangalore");
        List<College> expectedSearchResults = Arrays.asList(college1, college2);

        when(collegeRepository.findByNameContainingIgnoreCase(searchTerm)).thenReturn(expectedSearchResults);

        List<College> actualSearchResults = collegeService.searchColleges(searchTerm);

        assertNotNull(actualSearchResults);
        assertEquals(2, actualSearchResults.size());
        assertEquals(expectedSearchResults, actualSearchResults);
    }
}
