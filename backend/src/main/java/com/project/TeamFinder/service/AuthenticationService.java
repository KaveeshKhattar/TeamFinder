package com.project.TeamFinder.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.LoginUserDTO;
import com.project.TeamFinder.dto.RegisterUserDTO;
import com.project.TeamFinder.dto.VerifyUserDTO;
import com.project.TeamFinder.exception.AccountNotVerifiedException;
import com.project.TeamFinder.exception.IncorrectEmailException;
import com.project.TeamFinder.exception.IncorrectPasswordException;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.repository.CollegeRepresentativeRepository;
import com.project.TeamFinder.repository.UserRepository;

import jakarta.mail.MessagingException;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(
            UserRepository userRepository,
            CollegeRepresentativeRepository collegeRepresentativeRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // create verification code
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public boolean isEmailExists(String email) {
        return userRepository.existsByEmailContainingIgnoreCase(email);
    }

    public User loadUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.get();
    }

    // user sign up [verification code expires in 15 minutes]
    public User signup(RegisterUserDTO input) {
        User user = new User(input.getFirstName(), input.getLastName(),
                input.getEmail(),
                passwordEncoder.encode(input.getPassword()));

        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        return userRepository.save(user);
    }

    public void passwordChange(String email, String password) {
        // Find the user by email
        User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));

        // Encode the password
        String encodedPassword = passwordEncoder.encode(password);

        // Set the new password
        user.setPassword(encodedPassword);

        // Save the updated user
        userRepository.save(user);
    }

    public void sendEmailPassword(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.get();

        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        userRepository.save(user);
    }

    public void verifyUser(VerifyUserDTO input) {
        
        User user = userRepository.findByEmail(input.getEmail())
        .orElseThrow(() -> new RuntimeException("User with email " + input.getEmail() + " not found"));

        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AccountNotVerifiedException("Token has expired.");
        }
        if (user.getVerificationCode().equals(input.getVerificationCode())) {
            user.setEnabled(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
            userRepository.save(user);
        } else {
            throw new AccountNotVerifiedException("Wrong token.");
        }

    }

    public User authenticate(LoginUserDTO input) {

        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new IncorrectEmailException("Incorrect email"));

        if (!user.isEnabled()) {
            throw new AccountNotVerifiedException("Account not verified. Please verify your account.");
        }

        boolean isPasswordMatch = passwordEncoder.matches(input.getPassword(), user.getPassword());

        if (!isPasswordMatch) {
            throw new IncorrectPasswordException("Password is incorrect.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()));

        return user;
    }

    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private void sendVerificationEmail(User user) {
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to Team Finder!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }

}
