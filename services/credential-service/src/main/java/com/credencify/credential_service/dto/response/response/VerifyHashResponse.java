package com.credencify.credential_service.dto.response.response;

import com.credencify.credential_service.enums.CertificateStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifyHashResponse {
    private String certificateId;
    private String hash;
    private String learnerName;
    private String courseName;
    private String institutionName;
    private CertificateStatus status;
    private LocalDateTime issuedAt;
}
