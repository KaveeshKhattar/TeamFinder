package com.project.TeamFinder.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventDTO {
    private String name;
    private String Date;
    private String venue;
    private int teamSize;
    private String description;
    private Long college_id;
}