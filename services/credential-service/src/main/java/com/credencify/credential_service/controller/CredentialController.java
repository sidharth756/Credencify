package com.credencify.credential_service.controller;

import com.credencify.credential_service.dto.request.CertificateRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.VerifyHashResponse;
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
    public ResponseEntity<String> issueCertificate(@RequestBody CertificateRequest req) throws Exception{
        String hashed = credentialService.hash(credentialService.combineString(req));
        StoreHashResponse response = credentialService.issueCertificate(req);
       //return ResponseEntity.ok("Done :" + hashed);
        return ResponseEntity.status(HttpStatus.CREATED).body(response.getMessage() + ", Transcation: " + response.getTransactionHash());
    }
    @GetMapping("/{certificateId}")
    public ResponseEntity<VerifyHashResponse> verify(@PathVariable String certificateId){
        VerifyHashResponse response = credentialService.verify(certificateId);
        return  ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
