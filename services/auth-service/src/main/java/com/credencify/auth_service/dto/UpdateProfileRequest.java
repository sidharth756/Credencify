package com.credencify.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateProfileRequest {
    private String fullName;
    private String email;
    private String password;

    // Learner & Profile detail fields
    private String dob;
    private String gender;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String profileImageUrl;

    // Institution profile fields
    private String institutionCode;
    private String registrationNumber;
    private String contactNumber;
    private String websiteUrl;
    private String logoUrl;
}
