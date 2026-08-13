package com.credencify.verificationservice.dto.response;

import com.credencify.verificationservice.enums.CertificateStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.*;

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