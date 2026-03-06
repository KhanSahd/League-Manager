package com.sahdkhan.leaguemanager.passwordReset;

import com.resend.core.exception.ResendException;
import com.sahdkhan.leaguemanager.responses.ApiResponse;
import jakarta.validation.constraints.Email;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> requestReset( @RequestBody ResetRequest request)
    {
        System.out.println("RESET ENDPOINT HIT");
        resetService.processRequest(request.email());
        return ResponseEntity.ok(
                new ApiResponse("If the email is registered, you'll get a reset link")
        );
    }
}
