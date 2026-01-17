package com.project.TeamFinder.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.EmailRequestDTO;
import com.project.TeamFinder.dto.LoginUserDTO;
import com.project.TeamFinder.dto.PasswordChangeDTO;
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

    // sign up
    @PostMapping(value="/signup", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<User>> signup(@RequestBody RegisterUserDTO registerUserDto) {
        System.out.println("*** Sign up got called ***");
        User registeredUser = authenticationService.signup(registerUserDto);
        ApiResponse<User> response = new ApiResponse<User>(true, registeredUser, "Sign up Successful");
        return ResponseEntity.ok(response);
    }

    // sending token to email before able to change password
    @PostMapping(value="/changePasswordVerify", produces = MediaType.APPLICATION_JSON_VALUE)
    public void sendEmailForPasswordChange(@RequestBody EmailRequestDTO emailRequest) {
        System.out.println("*** Sending email for pwd change ***");
        authenticationService.sendEmailPassword(emailRequest.getEmail());
    }

    // update the password
    @PostMapping(value="/updatePassword", produces = MediaType.APPLICATION_JSON_VALUE)
    public void changePassword(@RequestBody PasswordChangeDTO passwordChangeDTO) {
        System.out.println("*** Pwd change ***");
        authenticationService.passwordChange(passwordChangeDTO.getEmail(), passwordChangeDTO.getPassword());
    }

    // login
    @PostMapping(value="/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<LoginResponse>> authenticate(@RequestBody LoginUserDTO loginUserDto){
        System.out.println("*** Log in got called ***");
        
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        String refreshToken = jwtService.generateRefreshToken(authenticatedUser);

        // Send both tokens back to the client
        Map<String, String> tokens = new HashMap<>();
        tokens.put("token", jwtToken);
        tokens.put("refreshToken", refreshToken);

        
        LoginResponse loginResponse = new LoginResponse(jwtToken, refreshToken, jwtService.getExpirationTime());
        
        // LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        ApiResponse<LoginResponse> response = new ApiResponse<LoginResponse>(true, loginResponse, "Login Successful");
        
        return ResponseEntity.ok(response);
    }

    // refresh the JWT
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (jwtService.isRefreshTokenValid(refreshToken)) {
            String username = jwtService.extractUsername(refreshToken);
            UserDetails userDetails = authenticationService.loadUserByEmail(username);
            String newAccessToken = jwtService.generateToken(userDetails);

            Map<String, String> response = new HashMap<>();
            response.put("accessToken", newAccessToken);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // verify the OTP sent to the user email
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyUser(@RequestBody VerifyUserDTO verifyUserDto) {
        System.out.println("*** Verify got called ***");
        authenticationService.verifyUser(verifyUserDto);
        ApiResponse<String> response = new ApiResponse<String>(true, "User Verified", "Verification Successful");
        return ResponseEntity.ok(response);
    }

    // resend the OTP to verify user
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
