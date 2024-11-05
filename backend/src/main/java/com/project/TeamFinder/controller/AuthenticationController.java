package com.project.TeamFinder.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.LoginUserDTO;
import com.project.TeamFinder.dto.RegisterUserDTO;
import com.project.TeamFinder.dto.VerifyUserDTO;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.responses.ApiResponse;
import com.project.TeamFinder.responses.LoginResponse;
import com.project.TeamFinder.service.AuthenticationService;
import com.project.TeamFinder.service.JwtService;
import org.springframework.web.bind.annotation.GetMapping;


@RequestMapping("/auth")
@RestController
@CrossOrigin
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;        
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDTO registerUserDto) {
        System.out.println("*** Sign up got called ***");
        User registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping(value="/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<LoginResponse>> authenticate(@RequestBody LoginUserDTO loginUserDto){
        System.out.println("*** Log in got called ***");
        
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        ApiResponse<LoginResponse> response = new ApiResponse<LoginResponse>(true, loginResponse, "Login Successful");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDTO verifyUserDto) {
        try {
            System.out.println("*** Verify got called ***");
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            System.out.println("*** Resend got called ***");
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("check-email")
    public ResponseEntity<Map<String, Boolean>> doesEmailExist(@RequestParam String email) {
        boolean emailExists = authenticationService.isEmailExists(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", emailExists);
        return ResponseEntity.ok(response);
    }
    

}
