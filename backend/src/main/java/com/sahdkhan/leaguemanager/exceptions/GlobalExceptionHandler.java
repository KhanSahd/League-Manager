package com.sahdkhan.leaguemanager.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler
{
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentials( InvalidCredentialsException ex) {
        return ResponseEntity
                .status( HttpStatus.UNAUTHORIZED)
                .body( Map.of(
                        "status", 401,
                        "error", "Unauthorized",
                        "message", ex.getMessage(),
                        "timestamp", Instant.now().toString()
                ));
    }
}
