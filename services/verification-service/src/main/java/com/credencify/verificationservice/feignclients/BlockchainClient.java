package com.credencify.verificationservice.feignclients;

import com.credencify.verificationservice.dto.response.VerifyHashResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "blockchain-service")
public interface BlockchainClient {
    @GetMapping("/internal/verify")
    VerifyHashResponse getHash(@PathVariable("certificateId")String certificateId);
}
