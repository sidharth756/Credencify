package com.credencify.verificationservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiAuditResponse {
    private String certificateId;
    private String qrCertificateId;
    private String learnerName;
    private String courseName;
    private String institutionName;
    private String status;
    private String issuedAt;
    private String hash;
    private int matchScore;
    private List<String> anomalies;
    private Map<String, String> comparisons;
    private String rawText;
}
