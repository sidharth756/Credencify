package com.credencify.credential_service.service;

import com.credencify.credential_service.dto.request.CertificateRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.VerifyHashResponse;

public interface CredentialService {

    StoreHashResponse issueCertificate(CertificateRequest req) throws Exception;

    String combineString(CertificateRequest req);

    String hash(String combined) throws Exception;

    VerifyHashResponse verify(String certificateId);


}
