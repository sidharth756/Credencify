package com.credencify.credential_service.service;

import com.credencify.credential_service.dto.request.CertificateRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.VerifyHashResponse;
import com.credencify.credential_service.entity.CertificateEntity;

public interface CredentialService {

    StoreHashResponse issueCertificate(CertificateRequest req) throws Exception;

    String combineString(CertificateRequest req);

    String hash(String combined) throws Exception;

    VerifyHashResponse verify(String certificateId) throws Exception;

    StoreHashResponse saveCertificate(CertificateRequest request,StoreHashResponse response);

    CertificateEntity getCertificate(String certificateID) throws Exception;

}
