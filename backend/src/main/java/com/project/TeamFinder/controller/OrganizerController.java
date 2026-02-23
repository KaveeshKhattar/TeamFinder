package com.project.TeamFinder.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.project.TeamFinder.dto.TeamWithMembersDTO;
import com.project.TeamFinder.dto.organizer.BulkImportResultDTO;
import com.project.TeamFinder.dto.organizer.EventMetricsDTO;
import com.project.TeamFinder.dto.organizer.MergeTeamsRequestDTO;
import com.project.TeamFinder.dto.organizer.SplitTeamRequestDTO;
import com.project.TeamFinder.dto.organizer.TeamJoinRequestDTO;
import com.project.TeamFinder.dto.organizer.UpdateTeamOrganizerRequestDTO;
import com.project.TeamFinder.dto.responses.ApiResponse;
import com.project.TeamFinder.service.OrganizerAccessService;
import com.project.TeamFinder.service.OrganizerService;

@RestController
@RequestMapping("/api/organizer")
@CrossOrigin
public class OrganizerController {
    private final OrganizerService organizerService;
    private final OrganizerAccessService organizerAccessService;

    public OrganizerController(OrganizerService organizerService, OrganizerAccessService organizerAccessService) {
        this.organizerService = organizerService;
        this.organizerAccessService = organizerAccessService;
    }

    private String requireUserEmail(UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return userDetails.getUsername();
    }

    private void ensureOrganizerForEvent(UserDetails userDetails, Long eventId) {
        String email = requireUserEmail(userDetails);
        if (!organizerAccessService.canManageEvent(email, eventId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Organizer access required");
        }
    }

    private void ensureOrganizerForTeam(UserDetails userDetails, Long teamId) {
        String email = requireUserEmail(userDetails);
        if (!organizerAccessService.canManageTeam(email, teamId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Organizer access required");
        }
    }

    @GetMapping("/events/{eventId}/metrics")
    public ResponseEntity<ApiResponse<EventMetricsDTO>> getEventMetrics(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Integer targetTeamSize) {
        ensureOrganizerForEvent(userDetails, eventId);
        EventMetricsDTO metrics = organizerService.getEventMetrics(eventId, targetTeamSize);
        return ResponseEntity.ok(new ApiResponse<>(true, metrics, "event metrics"));
    }

    @PostMapping(value = "/events/{eventId}/import/participants", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BulkImportResultDTO>> importParticipants(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {
        ensureOrganizerForEvent(userDetails, eventId);
        BulkImportResultDTO result = organizerService.importParticipants(eventId, file);
        return ResponseEntity.ok(new ApiResponse<>(true, result, "participants imported"));
    }

    @PostMapping(value = "/events/{eventId}/import/teams", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BulkImportResultDTO>> importTeams(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {
        ensureOrganizerForEvent(userDetails, eventId);
        BulkImportResultDTO result = organizerService.importTeams(eventId, file);
        return ResponseEntity.ok(new ApiResponse<>(true, result, "teams imported"));
    }

    @GetMapping("/events/{eventId}/join-requests")
    public ResponseEntity<ApiResponse<List<TeamJoinRequestDTO>>> getJoinRequests(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        ensureOrganizerForEvent(userDetails, eventId);
        List<TeamJoinRequestDTO> requests = organizerService.getJoinRequests(eventId);
        return ResponseEntity.ok(new ApiResponse<>(true, requests, "join requests"));
    }

    @PostMapping("/teams/{teamId}/join-requests/{userId}/approve")
    public ResponseEntity<ApiResponse<String>> approveJoinRequest(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        ensureOrganizerForTeam(userDetails, teamId);
        organizerService.approveJoinRequest(teamId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "approved", "join request approved"));
    }

    @PostMapping("/teams/{teamId}/join-requests/{userId}/reject")
    public ResponseEntity<ApiResponse<String>> rejectJoinRequest(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        ensureOrganizerForTeam(userDetails, teamId);
        organizerService.rejectJoinRequest(teamId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "rejected", "join request rejected"));
    }

    @PutMapping("/teams/{teamId}")
    public ResponseEntity<ApiResponse<TeamWithMembersDTO>> updateTeam(
            @PathVariable Long teamId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateTeamOrganizerRequestDTO request) {
        ensureOrganizerForTeam(userDetails, teamId);
        TeamWithMembersDTO team = organizerService.updateTeam(teamId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, team, "team updated"));
    }

    @PostMapping("/teams/merge")
    public ResponseEntity<ApiResponse<String>> mergeTeams(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody MergeTeamsRequestDTO request) {
        ensureOrganizerForTeam(userDetails, request.getFromTeamId());
        ensureOrganizerForTeam(userDetails, request.getToTeamId());
        organizerService.mergeTeams(request.getFromTeamId(), request.getToTeamId());
        return ResponseEntity.ok(new ApiResponse<>(true, "merged", "teams merged"));
    }

    @PostMapping("/teams/{teamId}/split")
    public ResponseEntity<ApiResponse<TeamWithMembersDTO>> splitTeam(
            @PathVariable Long teamId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody SplitTeamRequestDTO request) {
        ensureOrganizerForTeam(userDetails, teamId);
        TeamWithMembersDTO newTeam = organizerService.splitTeam(teamId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, newTeam, "team split"));
    }

    @GetMapping("/events/{eventId}/export-team-sheet")
    public ResponseEntity<byte[]> exportTeamSheet(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        ensureOrganizerForEvent(userDetails, eventId);
        String csv = organizerService.exportFinalTeamSheet(eventId);
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=event-" + eventId + "-teams.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }
}
