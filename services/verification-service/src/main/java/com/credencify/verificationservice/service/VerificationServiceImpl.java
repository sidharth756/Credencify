package com.credencify.verificationservice.service;

import com.credencify.verificationservice.dto.response.CertificateResponse;
import com.credencify.verificationservice.dto.response.VerifyHashResponse;
import com.credencify.verificationservice.enums.CertificateStatus;
import com.credencify.verificationservice.exception.CertifcateNotFoundException;
import com.credencify.verificationservice.feignclients.BlockchainClient;
import com.credencify.verificationservice.feignclients.CredentialClient;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {

    private final BlockchainClient blockchainClient;
    private final CredentialClient credentialClient;

    @Override
    public VerifyHashResponse verify(String certificateId) throws Exception {
        try {
            // 1. Get verification hash proof from blockchain
            VerifyHashResponse response = blockchainClient.getHash(certificateId);

            // 2. Get local record details from credential service
            CertificateResponse certificate = credentialClient.getCertificate(certificateId);

            if (certificate == null) {
                throw new CertifcateNotFoundException("Certificate record not found in database.");
            }

            // 3. Compare database hash with blockchain hash proof
            if (certificate.getCertificateHash().equalsIgnoreCase(response.getHash())) {
                response.setLearnerName(certificate.getLearnerName());
                response.setCourseName(certificate.getCourseName());
                response.setInstitutionName(certificate.getInstitutionName());
                response.setStatus(CertificateStatus.valueOf(certificate.getStatus()));
                response.setIssuedAt(certificate.getCreatedAt());
                return response;
            } else {
                throw new RuntimeException("Security verification failed: certificate hash mismatch!");
            }
        } catch (FeignException.NotFound ex) {
            throw new CertifcateNotFoundException("Certificate record not found for ID: " + certificateId);
        }
    }
}
