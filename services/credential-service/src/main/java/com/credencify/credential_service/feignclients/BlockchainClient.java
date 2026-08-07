package com.credencify.credential_service.feignclients;

import com.credencify.credential_service.dto.request.StoreHashRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.VerifyHashResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigInteger;

@FeignClient(name = "blockchain-service")
public interface BlockchainClient {
    @PostMapping("/internal/blockchain")
    StoreHashResponse storeHash(@RequestBody StoreHashRequest request);

    @GetMapping("/internal/blockchain/{certificateId}")
    VerifyHashResponse getHash(@PathVariable("certificateId")String certificateId);

}
