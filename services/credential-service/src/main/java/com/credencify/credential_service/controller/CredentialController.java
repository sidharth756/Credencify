package com.credencify.credential_service.controller;

import com.credencify.credential_service.dto.response.request.CertificateRequest;
import com.credencify.credential_service.dto.response.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.response.VerifyHashResponse;
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
       //return ResponseEntity.ok("Done :" + hashed);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping("/{certificateId}")
    public ResponseEntity<VerifyHashResponse> verify(@PathVariable String certificateId) throws Exception{
        VerifyHashResponse response = credentialService.verify(certificateId);
        return  ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
