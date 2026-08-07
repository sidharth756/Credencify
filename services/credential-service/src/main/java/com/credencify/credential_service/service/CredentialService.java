package com.credencify.credential_service.service;

import com.credencify.credential_service.dto.request.CertificateRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;

public interface CredentialService {

    StoreHashResponse issueCertificate(CertificateRequest req) throws Exception;

    String combineString(CertificateRequest req);

    String hash(String combined) throws Exception;


}
