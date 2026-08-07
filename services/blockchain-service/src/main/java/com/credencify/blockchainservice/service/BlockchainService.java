package com.credencify.blockchainservice.service;

import com.credencify.blockchainservice.wrapper.CertificateStorage;
import com.credencify.blockchainservice.dto.response.request.StoreHashRequest;
import com.credencify.blockchainservice.dto.response.response.StoreHashResponse;
import com.credencify.blockchainservice.dto.response.response.VerifyHashResponse;

import java.math.BigInteger;

public interface BlockchainService {
    CertificateStorage getContract();
    StoreHashResponse storeHash(StoreHashRequest req) throws Exception;
    VerifyHashResponse getHash(String certificateId) throws Exception;

}
