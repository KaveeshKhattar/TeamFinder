package com.project.TeamFinder.exception;

import org.hibernate.exception.SQLGrammarException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.project.TeamFinder.responses.ApiResponse;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex) {
        ApiResponse<String> response = new ApiResponse<String>(false, null, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex) {
        ApiResponse<String> response = new ApiResponse<>(false, null, "An internal server error occurred: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(IncorrectEmailException.class)
    public ResponseEntity<ApiResponse<String>> handleIncorrectEmailException(IncorrectEmailException ex) {
        ApiResponse<String> response = new ApiResponse<>(false, null, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(NotRepresentativeException.class)
    public ResponseEntity<ApiResponse<String>> handleNotRepresentative(NotRepresentativeException ex) {
        ApiResponse<String> response = new ApiResponse<>(false, null, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AccountAlreadyExists.class)
    public ResponseEntity<ApiResponse<String>> handleAccountAlreadyExists(AccountAlreadyExists ex) {
        ApiResponse<String> response = new ApiResponse<>(false, null, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AccountNotVerifiedException.class)
    public ResponseEntity<ApiResponse<String>> handleAccountNotVerifiedException(AccountNotVerifiedException ex) {
        ApiResponse<String> response = new ApiResponse<>(false, null, ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(NoCollegesException.class)
    public ResponseEntity<ApiResponse<String>> handleNoCollegesException(NoCollegesException ex) {
        System.out.println("Called here");
        ApiResponse<String> response = new ApiResponse<>(true, null, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

    @ExceptionHandler(SQLGrammarException.class)
    public ResponseEntity<ApiResponse<String>> handleSQLGrammarException(SQLGrammarException ex) {
        ApiResponse<String> response = new ApiResponse<>(false, null, "Database error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(JpaSystemException.class)
    public ResponseEntity<ApiResponse<String>> handleJpaSystemException(JpaSystemException ex) {
        ApiResponse<String> response = new ApiResponse<>(false, null, "Database error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(BadSqlGrammarException.class)
    public ResponseEntity<ApiResponse<String>> handleBadSqlGrammarException(BadSqlGrammarException ex) {
        ApiResponse<String> response = new ApiResponse<>(false, null, "Database error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}