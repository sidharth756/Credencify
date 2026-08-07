package com.credencify.credential_service.service;

import com.credencify.credential_service.dto.request.CertificateRequest;
import com.credencify.credential_service.dto.request.StoreHashRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;
import com.credencify.credential_service.feignclients.BlockchainClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.math.BigInteger;
import java.security.MessageDigest;   // <-- correct import
import java.nio.charset.StandardCharsets;

@Service
public class CredentialServiceImpl implements CredentialService{
    private final BlockchainClient blockchainClient;

    public CredentialServiceImpl(BlockchainClient blockchainClient) {
        this.blockchainClient = blockchainClient;
    }

    @Override
    public StoreHashResponse issueCertificate(CertificateRequest req) throws Exception{
        String combined = combineString(req);
        String hashed = hash(combined);

        StoreHashRequest request = new StoreHashRequest(req.getCertificateId(),hashed);
        StoreHashResponse response = blockchainClient.storeHash(request);
        System.out.println( response.getMessage() + " " + response.getTransactionHash() );
        return response;
    }

    @Override
    public String combineString(CertificateRequest req) {
        return req.getCertificateId() + "|" + req.getLeanerName() + "|" + req.getCourseName() + "|" + req.getInstitutionName();
    }

    @Override
    public String hash(String combined) throws Exception{
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        byte[] hashBytes = md.digest(combined.getBytes(StandardCharsets.UTF_8));

        StringBuilder hex = new StringBuilder();

        for (byte b : hashBytes) {
            hex.append(String.format("%02x", b));
        }
        String hash = "0x" + hex.toString();
        return hash;
    }


}
