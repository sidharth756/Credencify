package com.credencify.verificationservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1.0/verify")
public class VerificationController {

    @GetMapping("/{certificateId}")
    public ResponseEntity<String> verifyCertificate(@PathVariable String certificateId){
        
    }
}
