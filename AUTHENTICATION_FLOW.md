# Authentication Flow Documentation

This document provides a comprehensive overview of the authentication system in TeamFinder, including all functions, endpoints, and the complete flow from signup to authenticated requests.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Components](#architecture-components)
3. [Authentication Flows](#authentication-flows)
   - [Signup Flow](#1-signup-flow)
   - [Email Verification Flow](#2-email-verification-flow)
   - [Login Flow](#3-login-flow)
   - [Password Reset Flow](#4-password-reset-flow)
   - [Token Refresh Flow](#5-token-refresh-flow)
4. [Security Configuration](#security-configuration)
5. [JWT Token Management](#jwt-token-management)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Function Reference](#function-reference)

---

## Overview

TeamFinder uses a JWT-based authentication system with email verification. The system includes:

- **User Registration** with email verification
- **JWT Access Tokens** for authenticated requests
- **Refresh Tokens** for token renewal
- **Password Reset** functionality
- **Spring Security** for request filtering and authentication

---

## Architecture Components

### Backend Components

1. **AuthenticationController** (`/auth/*`)
   - Handles all authentication-related HTTP requests
   - Coordinates between services

2. **AuthenticationService**
   - Business logic for authentication operations
   - User management and validation

3. **JwtService**
   - Token generation and validation
   - Token extraction and parsing

4. **EmailService**
   - Sends verification emails
   - Handles email communication

5. **JwtAuthenticationFilter**
   - Intercepts requests to validate JWT tokens
   - Sets up Spring Security context

6. **ApplicationConfiguration**
   - Configures Spring Security beans
   - Sets up password encoding and authentication providers

### Frontend Components

1. **Signup.tsx** - User registration form
2. **Verification.tsx** - Email verification form
3. **Login.tsx** - User login form
4. **ChangePasswordVerification.tsx** - Password reset verification
5. **ChangePassword.tsx** - Password update form

---

## Authentication Flows

### 1. Signup Flow

**Frontend:** `Signup.tsx` → **Backend:** `POST /auth/signup`

#### Step-by-Step Process:

1. **User submits registration form** (`Signup.tsx`)
   - Collects: firstName, lastName, email, password, confirmPassword
   - Validates password match
   - Sends POST request to `/auth/signup`

2. **AuthenticationController.signup()**
   - Receives `RegisterUserDTO`
   - Calls `AuthenticationService.signup()`

3. **AuthenticationService.signup()**
   - Creates new `User` entity
   - Encodes password using `BCryptPasswordEncoder`
   - Generates 6-digit verification code (100000-999999)
   - Sets verification code expiration (15 minutes from now)
   - Sets `enabled = false` (account not verified)
   - Calls `sendVerificationEmail()`
   - Saves user to database
   - Returns user object

4. **EmailService.sendVerificationEmail()**
   - Validates non-null parameters
   - Creates HTML email with verification code
   - Sends email via `JavaMailSender`

5. **Response to Frontend**
   - Returns success response with user data
   - Frontend navigates to `/verification` page

#### Functions Involved:

- `Signup.handleSubmit()` - Frontend form submission
- `AuthenticationController.signup()` - Endpoint handler
- `AuthenticationService.signup()` - Business logic
- `AuthenticationService.generateVerificationCode()` - Generates 6-digit code
- `AuthenticationService.sendVerificationEmail()` - Prepares email
- `EmailService.sendVerificationEmail()` - Sends email
- `UserRepository.save()` - Persists user

---

### 2. Email Verification Flow

**Frontend:** `Verification.tsx` → **Backend:** `POST /auth/verify`

#### Step-by-Step Process:

1. **User enters verification code** (`Verification.tsx`)
   - 6-digit OTP input component
   - Sends POST request to `/auth/verify` with email and code

2. **AuthenticationController.verifyUser()**
   - Receives `VerifyUserDTO` (email, verificationCode)
   - Calls `AuthenticationService.verifyUser()`

3. **AuthenticationService.verifyUser()**
   - Finds user by email
   - Validates verification code expiration (must be within 15 minutes)
   - Compares provided code with stored code
   - If valid:
     - Sets `enabled = true`
     - Clears verification code and expiration
     - Saves user
   - If invalid: throws `AccountNotVerifiedException`

4. **Response to Frontend**
   - Success: Navigates to `/login`
   - Error: Displays error message

#### Resend Verification Code

**Endpoint:** `POST /auth/resend?email={email}`

- Finds user by email
- Validates account is not already verified
- Generates new verification code
- Sets expiration to 1 hour (different from initial 15 minutes)
- Sends new verification email
- Saves updated user

#### Functions Involved:

- `Verification.handleSubmit()` - Frontend form submission
- `AuthenticationController.verifyUser()` - Endpoint handler
- `AuthenticationController.resendVerificationCode()` - Resend handler
- `AuthenticationService.verifyUser()` - Verification logic
- `AuthenticationService.resendVerificationCode()` - Resend logic
- `UserRepository.findByEmail()` - User lookup
- `UserRepository.save()` - Updates user

---

### 3. Login Flow

**Frontend:** `Login.tsx` → **Backend:** `POST /auth/login`

#### Step-by-Step Process:

1. **User submits login form** (`Login.tsx`)
   - Collects: email, password
   - Sends POST request to `/auth/login`

2. **AuthenticationController.authenticate()**
   - Receives `LoginUserDTO`
   - Calls `AuthenticationService.authenticate()`

3. **AuthenticationService.authenticate()**
   - Finds user by email (throws `IncorrectEmailException` if not found)
   - Validates account is enabled/verified (throws `AccountNotVerifiedException` if not)
   - Validates password using `passwordEncoder.matches()`
   - If password incorrect: throws `IncorrectPasswordException`
   - Authenticates via `AuthenticationManager` using Spring Security
   - Returns authenticated user

4. **JWT Token Generation** (`JwtService`)
   - Generates access token (expires based on `jwt.expiration-time`)
   - Generates refresh token (expires based on `jwt.refresh-token-expiration-time`)
   - Access token includes claim: `type: "access"`
   - Refresh token includes claim: `type: "refresh"`

5. **Response to Frontend**
   - Returns `LoginResponse` with:
     - `token` (JWT access token)
     - `refreshToken` (JWT refresh token)
     - `expirationTime` (token expiration in milliseconds)
   - Frontend stores tokens in localStorage
   - Starts token refresh timer
   - Updates auth context
   - Navigates to `/launch`

#### Functions Involved:

- `Login.handleSubmit()` - Frontend form submission
- `AuthenticationController.authenticate()` - Endpoint handler
- `AuthenticationService.authenticate()` - Authentication logic
- `JwtService.generateToken()` - Access token generation
- `JwtService.generateRefreshToken()` - Refresh token generation
- `JwtService.buildToken()` - Token construction
- `PasswordEncoder.matches()` - Password validation
- `AuthenticationManager.authenticate()` - Spring Security authentication

---

### 4. Password Reset Flow

**Frontend:** `ChangePasswordVerification.tsx` → `ChangePassword.tsx`  
**Backend:** `POST /auth/changePasswordVerify` → `POST /auth/updatePassword`

#### Step-by-Step Process:

1. **Request Password Reset** (`ChangePasswordVerification.tsx`)
   - User enters email
   - Sends POST to `/auth/changePasswordVerify`

2. **AuthenticationController.sendEmailForPasswordChange()**
   - Receives `EmailRequestDTO`
   - Calls `AuthenticationService.sendEmailPassword()`

3. **AuthenticationService.sendEmailPassword()**
   - Finds user by email
   - Generates new verification code
   - Sets expiration (15 minutes)
   - Temporarily disables account (`enabled = false`)
   - Sends verification email
   - Saves user

4. **User Verifies Code** (`ChangePasswordVerification.tsx`)
   - Similar to email verification flow
   - Navigates to password change form

5. **Update Password** (`ChangePassword.tsx`)
   - User enters new password
   - Sends POST to `/auth/updatePassword`

6. **AuthenticationController.changePassword()**
   - Receives `PasswordChangeDTO` (email, password)
   - Calls `AuthenticationService.passwordChange()`

7. **AuthenticationService.passwordChange()**
   - Finds user by email
   - Encodes new password
   - Updates user password
   - Saves user

#### Functions Involved:

- `ChangePasswordVerification.handleSubmit()` - Frontend verification
- `ChangePassword.handleSubmit()` - Frontend password update
- `AuthenticationController.sendEmailForPasswordChange()` - Email request handler
- `AuthenticationController.changePassword()` - Password update handler
- `AuthenticationService.sendEmailPassword()` - Email sending logic
- `AuthenticationService.passwordChange()` - Password update logic

---

### 5. Token Refresh Flow

**Frontend:** Automatic via `refreshtoken.ts` → **Backend:** `POST /auth/refresh-token`

#### Step-by-Step Process:

1. **Frontend Token Refresh Timer**
   - Monitors token expiration
   - Automatically requests new token before expiration

2. **AuthenticationController.refreshAccessToken()**
   - Receives refresh token in request body
   - Validates refresh token using `JwtService.isRefreshTokenValid()`

3. **JwtService.isRefreshTokenValid()**
   - Extracts claims from token
   - Checks if token is expired
   - Returns boolean

4. **New Token Generation**
   - Extracts username from refresh token
   - Loads user details
   - Generates new access token
   - Returns new access token

#### Functions Involved:

- `startTokenRefreshTimer()` - Frontend timer setup
- `AuthenticationController.refreshAccessToken()` - Refresh handler
- `JwtService.isRefreshTokenValid()` - Token validation
- `JwtService.extractUsername()` - Username extraction
- `AuthenticationService.loadUserByEmail()` - User loading
- `JwtService.generateToken()` - New token generation

---

## Security Configuration

### JwtAuthenticationFilter

**Purpose:** Intercepts all HTTP requests to validate JWT tokens

**Process:**

1. **Request Interception** (`doFilterInternal()`)
   - Extracts `Authorization` header
   - Checks for "Bearer " prefix
   - If no token: passes request through (unauthenticated)

2. **Token Validation**
   - Extracts JWT from header (removes "Bearer " prefix)
   - Extracts username from token
   - Loads user details from database
   - Validates token against user details

3. **Security Context Setup**
   - If token valid: creates `UsernamePasswordAuthenticationToken`
   - Sets authentication in `SecurityContextHolder`
   - Allows request to proceed

4. **Exception Handling**
   - Catches JWT exceptions
   - Uses `HandlerExceptionResolver` for proper error responses

**Functions:**
- `JwtAuthenticationFilter.doFilterInternal()` - Main filter logic
- `JwtService.extractUsername()` - Extract email from token
- `JwtService.isTokenValid()` - Validate token
- `UserDetailsService.loadUserByUsername()` - Load user

### ApplicationConfiguration

**Beans Configured:**

1. **UserDetailsService**
   - Loads users by email from `UserRepository`
   - Throws `UsernameNotFoundException` if user not found

2. **BCryptPasswordEncoder**
   - Password encoding/decoding
   - Used for password hashing

3. **AuthenticationManager**
   - Spring Security authentication manager
   - Handles authentication requests

4. **DaoAuthenticationProvider**
   - Links `UserDetailsService` and `PasswordEncoder`
   - Provides authentication logic

---

## JWT Token Management

### Token Structure

**Access Token:**
- **Subject:** User email
- **Claims:** `type: "access"`
- **Expiration:** Configurable (default from `application.properties`)
- **Algorithm:** HS256
- **Secret:** Base64-encoded key from properties

**Refresh Token:**
- **Subject:** User email
- **Claims:** `type: "refresh"`
- **Expiration:** Longer than access token
- **Algorithm:** HS256
- **Secret:** Same as access token

### JwtService Functions

1. **generateToken(UserDetails)** - Creates access token
2. **generateRefreshToken(UserDetails)** - Creates refresh token
3. **extractUsername(String token)** - Gets email from token
4. **extractClaim(String token, Function)** - Generic claim extraction
5. **isTokenValid(String token, UserDetails)** - Validates token
6. **isRefreshTokenValid(String token)** - Validates refresh token
7. **isTokenExpired(String token)** - Checks expiration
8. **extractAllClaims(String token)** - Parses JWT claims
9. **getSignInKey()** - Gets signing key from secret
10. **buildToken()** - Constructs JWT using JJWT library

---

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/signup` | Register new user | `RegisterUserDTO` | `ApiResponse<User>` |
| POST | `/auth/verify` | Verify email with OTP | `VerifyUserDTO` | `ApiResponse<String>` |
| POST | `/auth/resend` | Resend verification code | Query param: `email` | `String` |
| POST | `/auth/login` | User login | `LoginUserDTO` | `ApiResponse<LoginResponse>` |
| POST | `/auth/refresh-token` | Refresh access token | `{refreshToken: string}` | `{accessToken: string}` |
| POST | `/auth/changePasswordVerify` | Request password reset | `EmailRequestDTO` | `void` |
| POST | `/auth/updatePassword` | Update password | `PasswordChangeDTO` | `void` |
| GET | `/auth/check-email` | Check if email exists | Query param: `email` | `{exists: boolean}` |

### DTOs

**RegisterUserDTO:**
- `firstName: String`
- `lastName: String`
- `email: String`
- `password: String`

**LoginUserDTO:**
- `email: String`
- `password: String`

**VerifyUserDTO:**
- `email: String`
- `verificationCode: String`

**EmailRequestDTO:**
- `email: String`

**PasswordChangeDTO:**
- `email: String`
- `password: String`

---

## Function Reference

### AuthenticationController

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `signup()` | Register new user | `RegisterUserDTO` | `ResponseEntity<ApiResponse<User>>` |
| `authenticate()` | User login | `LoginUserDTO` | `ResponseEntity<ApiResponse<LoginResponse>>` |
| `verifyUser()` | Verify email OTP | `VerifyUserDTO` | `ResponseEntity<ApiResponse<String>>` |
| `resendVerificationCode()` | Resend OTP | `String email` | `ResponseEntity<?>` |
| `sendEmailForPasswordChange()` | Request password reset | `EmailRequestDTO` | `void` |
| `changePassword()` | Update password | `PasswordChangeDTO` | `void` |
| `refreshAccessToken()` | Refresh JWT token | `Map<String, String>` | `ResponseEntity<Map<String, String>>` |
| `doesEmailExist()` | Check email availability | `String email` | `ResponseEntity<Map<String, Boolean>>` |

### AuthenticationService

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `signup()` | Create new user account | `RegisterUserDTO` | `User` |
| `authenticate()` | Authenticate user credentials | `LoginUserDTO` | `User` |
| `verifyUser()` | Verify email with OTP | `VerifyUserDTO` | `void` |
| `resendVerificationCode()` | Resend verification email | `String email` | `void` |
| `sendEmailPassword()` | Send password reset email | `String email` | `void` |
| `passwordChange()` | Update user password | `String email, String password` | `void` |
| `loadUserByEmail()` | Load user by email | `String email` | `User` |
| `isEmailExists()` | Check if email exists | `String email` | `boolean` |
| `generateVerificationCode()` | Generate 6-digit OTP | None | `String` |
| `sendVerificationEmail()` | Send verification email | `User` | `void` |

### JwtService

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `generateToken()` | Create access token | `UserDetails` | `String` |
| `generateRefreshToken()` | Create refresh token | `UserDetails` | `String` |
| `extractUsername()` | Get email from token | `String token` | `String` |
| `isTokenValid()` | Validate token | `String token, UserDetails` | `boolean` |
| `isRefreshTokenValid()` | Validate refresh token | `String token` | `boolean` |
| `isTokenExpired()` | Check expiration | `String token` | `boolean` |
| `extractClaim()` | Extract specific claim | `String token, Function` | `T` |
| `extractAllClaims()` | Parse all claims | `String token` | `Claims` |
| `getExpirationTime()` | Get token expiration | None | `long` |

### EmailService

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `sendVerificationEmail()` | Send HTML email | `String to, String subject, String text` | `void` |

### JwtAuthenticationFilter

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `doFilterInternal()` | Filter HTTP requests | `HttpServletRequest, HttpServletResponse, FilterChain` | `void` |

---

## Security Features

1. **Password Hashing:** BCrypt with salt
2. **JWT Tokens:** Signed with HS256 algorithm
3. **Token Expiration:** Configurable expiration times
4. **Email Verification:** Required before account activation
5. **Refresh Tokens:** Separate tokens for token renewal
6. **Request Filtering:** All requests validated through JWT filter
7. **Account Locking:** Unverified accounts cannot login

---

## Configuration Properties

Required properties in `application.properties`:

```properties
# JWT Configuration
security.jwt.secret-key=<base64-encoded-secret>
security.jwt.expiration-time=<milliseconds>
security.jwt.refresh-token-expiration-time=<milliseconds>

# Email Configuration
spring.mail.host=<smtp-host>
spring.mail.port=<smtp-port>
spring.mail.username=<email-username>
spring.mail.password=<email-password>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## Error Handling

### Custom Exceptions

- **AccountNotVerifiedException:** Account not verified or verification code invalid/expired
- **IncorrectEmailException:** Email not found in database
- **IncorrectPasswordException:** Password does not match

### HTTP Status Codes

- **200 OK:** Successful operation
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Invalid/expired token or credentials
- **404 Not Found:** User/resource not found

---

## Frontend Token Management

1. **Storage:** Tokens stored in `localStorage`
   - `token`: Access token
   - `refreshToken`: Refresh token

2. **Automatic Refresh:** `refreshtoken.ts` monitors expiration and refreshes automatically

3. **Request Headers:** All authenticated requests include:
   ```
   Authorization: Bearer <access-token>
   ```

---

## Database Schema

### User Entity Fields

- `id`: Primary key (auto-generated)
- `email`: Unique, not null
- `firstName`: User's first name
- `lastName`: User's last name
- `password`: BCrypt hashed password
- `enabled`: Boolean (false until verified)
- `verificationCode`: 6-digit OTP (null after verification)
- `verificationCodeExpiresAt`: Expiration timestamp
- `pictureURL`: Profile picture URL (optional)
- `bio`: User biography (optional)
- `skills`: Array of skills (optional)

---

## Flow Diagrams

### Signup → Verification → Login

```
User → Signup Form → POST /auth/signup
  ↓
Backend: Create User (enabled=false)
  ↓
Send Verification Email (6-digit code, 15min expiry)
  ↓
User → Verification Form → POST /auth/verify
  ↓
Backend: Validate Code → Enable Account
  ↓
User → Login Form → POST /auth/login
  ↓
Backend: Authenticate → Generate JWT Tokens
  ↓
Frontend: Store Tokens → Navigate to App
```

### Password Reset Flow

```
User → Forgot Password → POST /auth/changePasswordVerify
  ↓
Backend: Generate Code → Send Email → Disable Account
  ↓
User → Verify Code → Navigate to Password Change
  ↓
User → New Password → POST /auth/updatePassword
  ↓
Backend: Update Password → Account Re-enabled
```

---

## Best Practices

1. **Token Security:**
   - Never expose tokens in URLs
   - Use HTTPS in production
   - Implement token rotation

2. **Password Security:**
   - Enforce strong password policies
   - Use BCrypt with appropriate cost factor
   - Never log passwords

3. **Email Verification:**
   - Set reasonable expiration times
   - Rate limit verification attempts
   - Clear codes after successful verification

4. **Error Messages:**
   - Don't reveal if email exists during login
   - Provide clear verification error messages
   - Log security events

---

## Troubleshooting

### Common Issues

1. **Token Expired:** Use refresh token to get new access token
2. **Account Not Verified:** Resend verification code
3. **Email Not Sending:** Check SMTP configuration
4. **Password Mismatch:** Verify BCrypt encoding matches
5. **JWT Invalid:** Check secret key and token format

---

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Account lockout after failed attempts
- [ ] Password strength validation
- [ ] Session management
- [ ] Remember me functionality
- [ ] Email change verification

---

**Last Updated:** 2026  
**Version:** 1.0
