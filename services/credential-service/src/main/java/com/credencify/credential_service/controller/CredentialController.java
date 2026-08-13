package com.credencify.credential_service.controller;

import com.credencify.credential_service.dto.request.CertificateRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.VerifyHashResponse;
import com.credencify.credential_service.entity.CertificateEntity;
import com.credencify.credential_service.service.CredentialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/certificates")
@CrossOrigin(origins = "*")
public class CredentialController {

    private final CredentialService credentialService;
    public CredentialController(CredentialService credentialService){
        this.credentialService =credentialService;
    }

    @PostMapping
    public ResponseEntity<StoreHashResponse> issueCertificate(@RequestBody CertificateRequest req) throws Exception{
        String hashed = credentialService.hash(credentialService.combineString(req));
        StoreHashResponse response = credentialService.issueCertificate(req);

        response = credentialService.saveCertificate(req,response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping("/{certificateId}")
    public ResponseEntity<VerifyHashResponse> verify(@PathVariable String certificateId) throws Exception{
        VerifyHashResponse response = credentialService.verify(certificateId);
        return  ResponseEntity.status(HttpStatus.OK).body(response);
    }

    //NOTE: this API Is only for the INTERNAL purpose do not use for Public
    @GetMapping("find/{certificateId}")
    public ResponseEntity<CertificateEntity> findCertificate(@PathVariable String certificateId) throws Exception{
        CertificateEntity certificate = credentialService.getCertificate(certificateId);
        return ResponseEntity.status(HttpStatus.OK).body(certificate);
    }

    @GetMapping("/institution/{institutionId}")
    public ResponseEntity<java.util.List<CertificateEntity>> getCertificatesByInstitution(@PathVariable String institutionId) {
        return ResponseEntity.ok(credentialService.getCertificatesByInstitution(institutionId));
    }

    @GetMapping("/learner/{learnerEmail}")
    public ResponseEntity<java.util.List<CertificateEntity>> getCertificatesByLearner(@PathVariable String learnerEmail) {
        return ResponseEntity.ok(credentialService.getCertificatesByLearner(learnerEmail));
    }
}
