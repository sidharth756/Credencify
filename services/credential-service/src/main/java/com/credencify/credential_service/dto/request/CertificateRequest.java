package com.credencify.credential_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateRequest {
    private String certificateId;
    private String leanerName;
    private String courseName;
    private String institutionName;


}
