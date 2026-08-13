package com.credencify.verificationservice.controller;

import com.credencify.verificationservice.dto.response.VerifyHashResponse;
import com.credencify.verificationservice.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1.0/verify")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VerificationController {

    private final VerificationService verificationService;

    @GetMapping("/{certificateId}")
    public ResponseEntity<VerifyHashResponse> verifyCertificate(@PathVariable String certificateId) throws Exception {
        VerifyHashResponse response = verificationService.verify(certificateId);
        return ResponseEntity.ok(response);
    }
}
