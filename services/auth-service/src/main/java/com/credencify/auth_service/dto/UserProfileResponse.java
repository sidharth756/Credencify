package com.credencify.auth_service.dto;

import com.credencify.auth_service.enums.Role;
import com.credencify.auth_service.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String userId;
    private String fullName;
    private String email;
    private Role role;
    private Status status;
    private Boolean isEmailVerified;

    // Learner profile fields
    private LocalDate dob;
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
