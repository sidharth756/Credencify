package com.credencify.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InstitutionRequest {
    @NotBlank(message = "User ID should not be empty")
    private String userId;
    @NotBlank(message = "Institution code should not be empty")
    private String institutionCode;
    @NotBlank(message = "Institution type should not be empty")
    private String institutionType;
    @NotBlank(message = "Registration number should not be empty")
    private String regNo;
    private String websiteUrl;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String logoUrl;
}