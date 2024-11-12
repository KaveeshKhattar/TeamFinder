package com.project.TeamFinder.IntegrationTesting;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.project.TeamFinder.controller.CollegeController;
import com.project.TeamFinder.model.College;
import com.project.TeamFinder.repository.CollegeRepository;
import com.project.TeamFinder.service.CollegeService;

@AutoConfigureJsonTesters
@WebMvcTest(CollegeController.class)
public class CollegeControllerIT {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private CollegeService collegeService;

    @MockBean
    private CollegeRepository collegeRepository;

    @Autowired
    private JacksonTester<College> jsonCollege;

    @Test
    public void testGetData() throws Exception {
        // given
        given(collegeRepository.findById(1L))
        .willReturn(Optional.of(new College(1L, "PES University", "Bangalore")));


        // when
        MockHttpServletResponse response = mockMvc.perform(
                get("/api/colleges")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        // then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEqualTo(
                jsonCollege.write(new College(1L, "PES University", "Bangalore")).getJson()
        );
    }

    // @Test
    // public void testGetData() throws Exception {
    //     // Mock the service call
    //     when(collegeService.findAllColleges()).thenReturn(new YourData());

    //     // Perform the GET request
    //     mockMvc.perform(get("/api/colleges"))
    //             .andExpect(status().isOk())
    //             .andExpect(jsonPath("$.field", is("expectedValue")));
    // }

}
