package com.project.TeamFinder.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.TeamFinder.dto.UpdateUserDTO;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.service.ImageHandlerService;
import com.project.TeamFinder.service.JwtService;
import com.project.TeamFinder.service.UserService;

import org.springframework.security.core.Authentication;

import java.io.File;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;


@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    
    private final UserService userService;
    private final JwtService jwtService;
    private final ImageHandlerService imageHandlerService;

    public UserController(UserService userService, JwtService jwtService, ImageHandlerService imageHandlerService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.imageHandlerService = imageHandlerService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List <User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Optional<User>> profile(@RequestHeader("Authorization") String token) {

        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        Optional<User> profile = userService.findByEmail(userEmail);
        
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestHeader("Authorization") String token, @RequestBody UpdateUserDTO updateUserDTO) {

        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        User updatedUser = userService.updateUser(userEmail, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }
    
    @GetMapping("/searchUsersByFullName")
    public List<User> getUsersByFirstName(@RequestHeader("Authorization") String token, @RequestParam String name) {
        List<User> filteredUsers = userService.getUsersByFullName(name);
        return filteredUsers;
    }
    
    @GetMapping("/checkIfRep")
    public Boolean getIfRep(@RequestHeader("Authorization") String token, @RequestParam("collegeId") Long collegeId) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);

        Optional<User> profile = userService.findByEmail(userEmail);
        User profileReal = profile.orElseThrow(() -> new RuntimeException("Team not found"));

        Boolean ans = userService.getIfRep(profileReal.getEmail(), collegeId);
        return ans;
    }

    @GetMapping("/checkIfRepProfile")
    public Boolean getIfRepNoCollegeId(@RequestHeader("Authorization") String token) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        Boolean ans = userService.getIfRepReal(userEmail);
        return ans;
    }

    @PostMapping("/upload")
    public String uploadImage(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) {
        System.out.println("uploading...");
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return "Invalid token";
        }

        // final String fileName = userEmail + ".png";
        // if (filename in connection then delete that then post this )

        try {

            // Convert MultipartFile to File
            File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempFile);
            System.out.println("Image name: " + tempFile.getName());
            String result = imageHandlerService.uploadFile(userEmail, tempFile, "image-store", file.getOriginalFilename());
            
            System.out.println(result);
            return "Passed";
        } catch (IOException e) {
            return "Failed";
        }
    }
    
    @DeleteMapping("/deleteProfilePicture")
    public ResponseEntity<String> deleteImage(@RequestHeader("Authorization") String token) {

        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid token");
        }
        
        String prefix = "";
        int index = userEmail.indexOf('@');
        if (index != -1) {
            prefix = userEmail.substring(0, index + 1) + userEmail.substring(index + 1, userEmail.indexOf('.', index)); // Include '@' and select until '.'
        }

        final String fileName = prefix + ".png";
        
        try {
            System.out.println("Calling service to delete file");
            String result = imageHandlerService.deleteFile("image-store", fileName);
            System.out.println("Delete result: " + result);
            return ResponseEntity.ok("File deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete file");
        }
    }

    @GetMapping("/fetchProfilePic")
    public String getImage(@RequestHeader("Authorization") String token) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);

        String prefix = "";
        int index = userEmail.indexOf('@');
        if (index != -1) {
            prefix = userEmail.substring(0, index + 1) + userEmail.substring(index + 1, userEmail.indexOf('.', index)); // Include '@' and select until '.'
        }
        
        final String fileName = prefix + ".png";
        System.out.println("Filename being searched for: " + fileName);
        
        try {
            byte[] data = imageHandlerService.getFile("image-store", fileName);
            if (data == null || data.length == 0) {
                return "Fail";
            }
            String base64String = Base64.getEncoder().encodeToString(data);
            return "data:image/png;base64," + base64String;

        } catch (Exception e) {
            return "Fail";
        }
    }

    @PostMapping("/uploadImageURL")
    public void postImageURL(@RequestHeader("Authorization") String token, @RequestBody String fileURL) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        System.out.println(userEmail + " Controller " + fileURL);
        userService.saveFileURL(userEmail, fileURL);
    }


    @DeleteMapping("/deleteImageURL")
    public void deleteImageURL(@RequestHeader("Authorization") String token) {
        final String jwt = token.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        System.out.println(userEmail + " Controller ");
        userService.deleteFileURL(userEmail);
    }
    


}
