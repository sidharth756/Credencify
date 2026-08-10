package com.credencify.credential_service.service;

import com.credencify.credential_service.dto.response.request.CertificateRequest;
import com.credencify.credential_service.dto.response.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.response.VerifyHashResponse;

public interface CredentialService {

    StoreHashResponse issueCertificate(CertificateRequest req) throws Exception;

    String combineString(CertificateRequest req);

    String hash(String combined) throws Exception;

    VerifyHashResponse verify(String certificateId) throws Exception;

    StoreHashResponse saveCertificate(CertificateRequest request,StoreHashResponse response);


}
