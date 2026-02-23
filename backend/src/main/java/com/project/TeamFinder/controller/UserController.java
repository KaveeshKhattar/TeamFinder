package com.project.TeamFinder.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.TeamFinder.dto.ImageRequestDTO;
import com.project.TeamFinder.dto.UserDTO;
import com.project.TeamFinder.dto.auth.UpdateUserDTO;
import com.project.TeamFinder.dto.auth.WaitlistRequestDTO;
import com.project.TeamFinder.dto.responses.ApiResponse;
import com.project.TeamFinder.projection.PublicUserProjection;
import com.project.TeamFinder.service.ImageHandlerService;
import com.project.TeamFinder.service.AdminAccessService;
import com.project.TeamFinder.service.OrganizerAccessService;
import com.project.TeamFinder.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.io.File;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private final UserService userService;
    private final ImageHandlerService imageHandlerService;
    private final OrganizerAccessService organizerAccessService;
    private final AdminAccessService adminAccessService;

    public UserController(
            UserService userService,
            ImageHandlerService imageHandlerService,
            OrganizerAccessService organizerAccessService,
            AdminAccessService adminAccessService) {
        this.userService = userService;
        this.imageHandlerService = imageHandlerService;
        this.organizerAccessService = organizerAccessService;
        this.adminAccessService = adminAccessService;
    }

    @PostMapping("/waitlist")
    public ResponseEntity<ApiResponse<String>> addToWaitlist(@RequestBody WaitlistRequestDTO request) {
        try {
            String email = request.getEmail();
            userService.addToWaitlist(email);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            null,
                            "Added to waitlist successfully"));
        } catch (DataIntegrityViolationException e) {
            // Duplicate email

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(
                            false,
                            null,
                            "This email is already on the waitlist"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            null,
                            "Failed to add to waitlist"));
        }
    }

    // Fetch all users
    @GetMapping("/all-users")
    public ResponseEntity<ApiResponse<List<PublicUserProjection>>> allUsers() {
        List<PublicUserProjection> users = userService.getAllPublicUsers();
        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            users,
                            "all users"));
    }

    @GetMapping("/is-organizer")
    public ResponseEntity<ApiResponse<Boolean>> isOrganizer(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(
                            false,
                            false,
                            "Unauthorized"));
        }
        boolean organizer = organizerAccessService.isOrganizer(userDetails.getUsername());
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                organizer,
                "organizer access"));
    }

    @GetMapping("/is-admin")
    public ResponseEntity<ApiResponse<Boolean>> isAdmin(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(
                            false,
                            false,
                            "Unauthorized"));
        }
        boolean admin = adminAccessService.isAdmin(userDetails.getUsername());
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                admin,
                "admin access"));
    }

    @GetMapping("/profile")
    public ApiResponse<UserDTO> profile() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails currentUser = (UserDetails) authentication.getPrincipal();
        String email = currentUser.getUsername();

        UserDTO user = userService.getProfile(email);
        
        return new ApiResponse<>(
                            true,
                            user,
                            "User");
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<String>> updateUser(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateUserDTO updateUserDTO) {

        try {
            final String userEmail = userDetails.getUsername();
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(
                            true,
                            null,
                            "Invalid token"));
            }

            userService.updateUser(userEmail, updateUserDTO);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            null,
                            "User updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            true,
                            null,
                            "Failed to update user"));
        }
    }

    @GetMapping("/profilePicture")
    public ResponseEntity<ApiResponse<String>> getImage(
            @AuthenticationPrincipal UserDetails userDetails) {

        final String userEmail = userDetails.getUsername();

        String prefix = "";
        int index = userEmail.indexOf('@');
        if (index != -1) {
            prefix = userEmail.substring(0, index);
        }

        final String fileName = prefix + ".png";

        try {
            byte[] data = imageHandlerService.getFile("image-store", fileName);
            if (data == null || data.length == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(
                                false,
                                null,
                                "Profile picture not found"));
            }
            String base64String = Base64.getEncoder().encodeToString(data); // Convert to Base64
            String imageData = "data:image/png;base64," + base64String;
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            imageData,
                            "Profile picture fetched successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            null,
                            "Failed to fetch profile picture"));
        }
    }

    @PostMapping("/profilePicture")
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        // Convert MultipartFile to File
        try {

            // File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
            // file.transferTo(tempFile);

            File tempFile = Objects.requireNonNull(
                    File.createTempFile("upload-", file.getOriginalFilename()),
                    "Temp file creation failed");

            file.transferTo(tempFile);

            imageHandlerService.uploadFile(tempFile, "image-store", file.getOriginalFilename());

            ApiResponse<String> response = new ApiResponse<>(
                    true,
                    "URL to be added here.",
                    "Image uploaded successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            ApiResponse<String> errorResponse = new ApiResponse<>(
                    false,
                    null,
                    "Failed to upload image");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping("/imageURL")
    public ResponseEntity<ApiResponse<String>> uploadPictureURL(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ImageRequestDTO request) {

        final String userEmail = userDetails.getUsername();
        

        userService.saveFileURL(userEmail, request.getFileURL());
        
        return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            null,
                            "Success"));
    }

    @DeleteMapping("/profilePicture")
    public ResponseEntity<ApiResponse<String>> deleteImage(@AuthenticationPrincipal UserDetails userDetails) {

        final String userEmail = userDetails.getUsername();
        
        String prefix = "";
        int index = userEmail.indexOf('@');
        if (index != -1) {
            prefix = userEmail.substring(0, index);
            // + userEmail.substring(index + 1, userEmail.indexOf('.', index)); // Include
            // '@' and select until '.'
        }

        final String fileName = prefix + ".png";

        try {

            String result = imageHandlerService.deleteFile("image-store", fileName);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(
                            true,
                            result,
                            "File deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            true,
                            null,
                            "Failed to delete file"));
        }
    }

    @DeleteMapping("/imageURL")
    public ResponseEntity<ApiResponse<String>> deleteImageURL(@AuthenticationPrincipal UserDetails userDetails) {

        final String userEmail = userDetails.getUsername();
        

        try {
            userService.deleteFileURL(userEmail);
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(new ApiResponse<>(
                            true,
                            null,
                            "Picture URL removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            null,
                            "Picture URL removal failed"));
        }
    }

}
