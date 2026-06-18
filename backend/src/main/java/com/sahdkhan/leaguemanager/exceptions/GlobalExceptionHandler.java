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
    public record ErrorResponse(int status, String error, String message, String timestamp) {}
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials( InvalidCredentialsException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                401,
                "Unauthorized",
                ex.getMessage(),
                Instant.now().toString()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler( IllegalArgumentException.class )
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException( IllegalArgumentException ex )
    {
        ErrorResponse errorResponse = new ErrorResponse(
                400,
                "Bad Request",
                ex.getMessage(),
                Instant.now().toString()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
