package com.project.TeamFinder.IntegrationTesting;

import com.project.TeamFinder.controller.CollegeController;
import com.project.TeamFinder.model.College;
import com.project.TeamFinder.service.CollegeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@WebMvcTest(CollegeController.class)
public class CollegeControllerIntegrationTest {

    @MockBean
    private CollegeService collegeService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testFindAllColleges() throws Exception {
        // Arrange
        List<College> colleges = Arrays.asList(
            new College((long) 1, "PES University", "Bangalore"),
            new College((long) 2, "RV University", "Bangalore")
        );

        System.out.println("Colleges: " + colleges);
        
        when(collegeService.findAllColleges()).thenReturn(colleges);

        // Act & Assert
        mockMvc.perform(get("/api/colleges")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("PES University"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("RV University"));
    }

    @Test
    public void testSearchColleges() throws Exception {
        // Arrange
        String searchQuery = "PES University";
        List<College> colleges = Arrays.asList(
            new College((long) 1, "PES University", "Bangalore")
        );
        when(collegeService.searchColleges(searchQuery)).thenReturn(colleges);

        // Act & Assert
        mockMvc.perform(get("/api/searchColleges")
                .param("name", searchQuery)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("PES University"));
    }

    @Test
    public void testSearchCollegesNoContent() throws Exception {
        // Arrange
        String searchQuery = "Non-Existent College";
        when(collegeService.searchColleges(searchQuery)).thenReturn(Arrays.asList());

        // Act & Assert
        mockMvc.perform(get("/api/searchColleges")
                .param("name", searchQuery)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
