package com.credencify.verificationservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponse {
    private String certificateId;
    private String courseName;
    private String learnerName;
    private String institutionName;
    private String certificateHash;
    private String status;
    private LocalDateTime createdAt;
}
