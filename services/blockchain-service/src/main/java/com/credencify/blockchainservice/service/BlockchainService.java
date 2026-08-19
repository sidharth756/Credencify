package com.credencify.blockchainservice.service;

import com.credencify.blockchainservice.wrapper.CertificateStorage;
import com.credencify.blockchainservice.dto.request.StoreHashRequest;
import com.credencify.blockchainservice.dto.response.StoreHashResponse;
import com.credencify.blockchainservice.dto.response.VerifyHashResponse;

public interface BlockchainService {
    CertificateStorage getContract();
    StoreHashResponse storeHash(StoreHashRequest req) throws Exception;
    VerifyHashResponse getHash(String certificateId) throws Exception;

}
