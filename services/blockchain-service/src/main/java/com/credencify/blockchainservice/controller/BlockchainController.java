package com.credencify.blockchainservice.controller;


import com.credencify.blockchainservice.dto.response.request.StoreHashRequest;
import com.credencify.blockchainservice.dto.response.response.StoreHashResponse;
import com.credencify.blockchainservice.dto.response.response.VerifyHashResponse;
import com.credencify.blockchainservice.service.BlockchainService;
import com.credencify.blockchainservice.service.BlockchainServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

@RestController
@RequestMapping("/internal/blockchain")
@CrossOrigin(origins = "*")
public class BlockchainController {
    private final BlockchainService blockchainService;
    public BlockchainController(BlockchainService blockchainService){
        this.blockchainService = blockchainService;
    }

    @PostMapping
    public ResponseEntity<StoreHashResponse> storeHash(@RequestBody StoreHashRequest req) throws Exception{
        StoreHashResponse response = blockchainService.storeHash(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<VerifyHashResponse> getHash(@PathVariable String certificateId) throws Exception{
        VerifyHashResponse response = blockchainService.getHash(certificateId);
        System.out.println("Certificate Id : "+ response.getCertificateId() + "Stored Hash : " + response.getHash());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
