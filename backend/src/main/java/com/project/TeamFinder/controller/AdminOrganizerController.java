package com.project.TeamFinder.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

import com.project.TeamFinder.dto.organizer.OrganizerAccessUpdateRequestDTO;
import com.project.TeamFinder.dto.responses.ApiResponse;
import com.project.TeamFinder.service.AdminAccessService;
import com.project.TeamFinder.service.OrganizerAccessService;

@RestController
@RequestMapping("/admin/organizers")
@CrossOrigin
public class AdminOrganizerController {
    private final OrganizerAccessService organizerAccessService;
    private final AdminAccessService adminAccessService;

    public AdminOrganizerController(OrganizerAccessService organizerAccessService, AdminAccessService adminAccessService) {
        this.organizerAccessService = organizerAccessService;
        this.adminAccessService = adminAccessService;
    }

    private String requireUserEmail(UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return userDetails.getUsername();
    }

    @PostMapping("/grant")
    public ResponseEntity<ApiResponse<String>> grantOrganizerAccess(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrganizerAccessUpdateRequestDTO request) {
        String requesterEmail = requireUserEmail(userDetails);
        adminAccessService.requireAdmin(requesterEmail);
        organizerAccessService.grantOrganizerAccess(request.getEventId(), request.getUserEmail());
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "granted",
                "organizer access granted"));
    }

    @PostMapping("/revoke")
    public ResponseEntity<ApiResponse<String>> revokeOrganizerAccess(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrganizerAccessUpdateRequestDTO request) {
        String requesterEmail = requireUserEmail(userDetails);
        adminAccessService.requireAdmin(requesterEmail);
        organizerAccessService.revokeOrganizerAccess(request.getEventId(), request.getUserEmail());
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "revoked",
                "organizer access revoked"));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<List<String>>> listOrganizersForEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long eventId) {
        String requesterEmail = requireUserEmail(userDetails);
        adminAccessService.requireAdmin(requesterEmail);
        List<String> organizerEmails = organizerAccessService.getOrganizerEmailsForEvent(eventId);
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                organizerEmails,
                "organizers for event"));
    }
}
