package com.credencify.credential_service.service;

import com.credencify.credential_service.dto.request.CertificateRequest;
import com.credencify.credential_service.dto.request.StoreHashRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.VerifyHashResponse;
import com.credencify.credential_service.entity.CertificateEntity;
import com.credencify.credential_service.enums.CertificateStatus;
import com.credencify.credential_service.exception.CertifcateNotFoundException;
import com.credencify.credential_service.exception.HashMismatchException;
import com.credencify.credential_service.exception.HashNotFoundException;
import com.credencify.credential_service.feignclients.BlockchainClient;
import com.credencify.credential_service.respository.CertificateRepository;
import feign.FeignException;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class CredentialServiceImpl implements CredentialService {
    private final BlockchainClient blockchainClient;
    private final CertificateRepository certificateRepository;

    public CredentialServiceImpl(BlockchainClient blockchainClient, CertificateRepository certificateRepository) {
        this.blockchainClient = blockchainClient;
        this.certificateRepository = certificateRepository;
    }

    @Override
    public StoreHashResponse issueCertificate(CertificateRequest req) throws Exception {
        String combined = combineString(req);
        String hashed = hash(combined);

        StoreHashRequest request = new StoreHashRequest(req.getCertificateId(), hashed);

        StoreHashResponse response = blockchainClient.storeHash(request);
        System.out.println(response.getMessage() + " " + response.getTransactionHash());
        return response;
    }

    @Override
    public String combineString(CertificateRequest req) {
        return req.getCertificateId() + "|" + req.getLearnerName() + "|" + req.getCourseName() + "|" + req.getInstitutionName();
    }

    @Override
    public String hash(String combined) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        byte[] hashBytes = md.digest(combined.getBytes(StandardCharsets.UTF_8));

        StringBuilder hex = new StringBuilder();

        for (byte b : hashBytes) {
            hex.append(String.format("%02x", b));
        }
        return "0x" + hex.toString();
    }

    @Override
    public VerifyHashResponse verify(String certificateId) throws Exception {
        try {
            VerifyHashResponse response = blockchainClient.getHash(certificateId);

            CertificateEntity certificate = certificateRepository.findByCertificateId(response.getCertificateId());

            System.out.println(certificate.toString());
            if (certificate.getCertificateHash().equals(response.getHash())) {
                response.setLearnerName(certificate.getLearnerName());
                response.setCourseName(certificate.getCourseName());
                response.setInstitutionName(certificate.getInstitutionName());
                response.setStatus(certificate.getStatus());
                response.setIssuedAt(certificate.getCreatedAt());
                return response;
            }
            throw new HashMismatchException("No certificate Matched");
        } catch (FeignException.NotFound ex) {
            throw new HashNotFoundException("No certificate hash found on blockchain for ID: " + certificateId);
        }
    }

    @Override
    public StoreHashResponse saveCertificate(CertificateRequest request, StoreHashResponse response) {
        CertificateEntity certificate = new CertificateEntity();

        certificate.setCertificateId(request.getCertificateId());
        certificate.setCourseName(request.getCourseName());
        certificate.setLearnerName(request.getLearnerName());
        certificate.setInstitutionName(request.getInstitutionName());
        certificate.setCertificateHash(response.getCertificateHash());
        certificate.setTransactionHash(response.getTransactionHash());
        certificate.setLearnEmail(request.getLearnerEmail());
        certificate.setInstitutionId(request.getInstitutionId());
        certificate.setLearnerId(request.getLearnerId());

        certificateRepository.save(certificate);
        CertificateEntity certificate1 = certificateRepository.findByCertificateId(request.getCertificateId());
        response.setUID(certificate1.getId());
        return response;
    }

    @Override
    public CertificateEntity getCertificate(String certificateID) throws Exception {
        Boolean isThere = certificateRepository.existsByCertificateId(certificateID);
        if (isThere) {
            return certificateRepository.findByCertificateId(certificateID);
        } else {
            throw new CertifcateNotFoundException("Certificate " + certificateID + " not found on DB");
        }
    }

    @Override
    public List<CertificateEntity> getCertificatesByInstitution(String institutionId) {
        return certificateRepository.findByInstitutionId(institutionId);
    }

    @Override
    public List<CertificateEntity> getCertificatesByLearner(String learnerEmail) {
        return certificateRepository.findByLearnEmail(learnerEmail);
    }

    @Override
    public List<CertificateEntity> getCertificatesByLearnerId(String learnerId) {
        return certificateRepository.findByLearnerId(learnerId);
    }

    @Override
    public CertificateEntity revokeCertificate(String certificateId) {
        CertificateEntity cert = certificateRepository.findByCertificateId(certificateId);
        if (cert == null) {
            throw new CertifcateNotFoundException("Certificate " + certificateId + " not found to revoke");
        }
        cert.setStatus(CertificateStatus.REVOKED);
        return certificateRepository.save(cert);
    }
}
