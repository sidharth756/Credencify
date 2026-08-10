package com.credencify.credential_service.controller;

import com.credencify.credential_service.dto.CredentialRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/certificates")
@CrossOrigin(origins = "*")
public class CredentialController {

    @PostMapping
    public ResponseEntity<String> issueCertificate(@RequestBody CredentialRequest req){
        String combined = req.getCertificateId() + "|" + req.getLeanerName() +"|" + req.getCourseName() + "|" + req.getInstitutionName();
        return ResponseEntity.ok("Combined String: " + combined);
    }
}
