package com.credencify.verificationservice.feignclients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.cert.Certificate;

@FeignClient(name = "credential-service")
public interface CredentialClient {
    @GetMapping("api/certificates")
    Certificate getcertificate(@PathVariable("find/{certificateID}") String certificateId);
}
