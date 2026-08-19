package com.credencify.verificationservice.service;

import com.credencify.verificationservice.dto.response.AiAuditResponse;
import com.credencify.verificationservice.dto.response.VerifyHashResponse;
import com.credencify.verificationservice.entity.AuditLog;
import com.credencify.verificationservice.entity.VerificationLog;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface VerificationService {
    VerifyHashResponse verify(String certificateId) throws Exception;
    VerifyHashResponse verify(String certificateId, String verifiedBy) throws Exception;
    AiAuditResponse auditDocument(MultipartFile file, String expectedCertificateId) throws Exception;
    AiAuditResponse auditDocument(MultipartFile file, String expectedCertificateId, String verifiedBy) throws Exception;
    List<VerificationLog> getVerificationLogs() throws Exception;
    List<AuditLog> getAuditLogs() throws Exception;
}
