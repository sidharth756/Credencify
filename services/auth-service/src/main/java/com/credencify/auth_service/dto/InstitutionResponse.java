package com.credencify.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InstitutionResponse {

    private Long id;
    private String userId;
    private String institutionCode;
    private String institutionType;
    private String regNo;
    private String websiteUrl;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String logoUrl;
    private Boolean isApproved;
    private Timestamp approvedAt;
}