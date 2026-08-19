package com.credencify.verificationservice.feignclients;

import com.credencify.verificationservice.dto.response.CertificateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "credential-service")
public interface CredentialClient {
    
    @GetMapping("/api/certificates/find/{certificateId}")
    CertificateResponse getCertificate(@PathVariable("certificateId") String certificateId);
}
