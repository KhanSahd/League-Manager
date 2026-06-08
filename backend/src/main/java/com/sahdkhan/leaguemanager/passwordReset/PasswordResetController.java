package com.sahdkhan.leaguemanager.passwordReset;

import com.resend.core.exception.ResendException;
import com.sahdkhan.leaguemanager.responses.ApiResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController
{
    private final PasswordResetService resetService;

    public PasswordResetController(PasswordResetService resetService) {
        this.resetService = resetService;
    }

    record ResetRequest(@Email String email) {}

    record ResetInfo( @Email String token, @NotBlank String password ) {}

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> requestReset( @RequestBody ResetRequest request)
    {
        System.out.println("RESET ENDPOINT HIT");
        resetService.processRequest(request.email());
        return ResponseEntity.ok(
                new ApiResponse("If the email is registered, you'll get a reset link")
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> submitPasswordReset( @RequestBody ResetInfo request )
    {
        try
        {
            resetService.resetPassword( request.token, request.password );
            return ResponseEntity.ok("Password Successfully Updated");
        }
        catch ( Exception e )
        {
            return ResponseEntity.status( HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
