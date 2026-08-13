package com.credencify.verificationservice.service;

import com.credencify.verificationservice.dto.response.VerifyHashResponse;
import com.credencify.verificationservice.feignclients.BlockchainClient;
import com.credencify.verificationservice.feignclients.CredentialClient;

public class VerificationServiceImpl implements VerificationService{


    final BlockchainClient blockchainClient;
    private final CredentialClient credentialClient;

    public VerificationServiceImpl(BlockchainClient blockchainClient,CredentialClient credentialClient){
        this.blockchainClient = blockchainClient;
        this.credentialClient = credentialClient;
    }

    @Override
    public VerifyHashResponse verify(String certificateId) throws Exception {
        try {
            VerifyHashResponse response = blockchainClient.getHash(certificateId);

        }
    }
}
