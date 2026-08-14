package com.credencify.auth_service.service;

import com.credencify.auth_service.dto.RegisterRequest;
import com.credencify.auth_service.dto.RegisterResponse;
import com.credencify.auth_service.entity.UserEntity;
import com.credencify.auth_service.entity.LearnerEntity;
import com.credencify.auth_service.entity.InstitutionEntity;
import com.credencify.auth_service.enums.Role;
import com.credencify.auth_service.enums.Status;
import com.credencify.auth_service.repository.UserRepository;
import com.credencify.auth_service.repository.LearnerRepository;
import com.credencify.auth_service.repository.InstitutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LearnerRepository learnerRepository;
    private final InstitutionRepository institutionRepository;

    @Override
    public RegisterResponse createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email Already Exists");
        }
        
        Role role = Role.valueOf(request.getRole().toUpperCase());
        String generatedUserId;
        if (role == Role.LEARNER) {
            generatedUserId = generateNextLearnerId();
        } else {
            generatedUserId = UUID.randomUUID().toString();
            while (userRepository.existsByUserId(generatedUserId)) {
                generatedUserId = UUID.randomUUID().toString();
            }
        }

        UserEntity newUserEntity = UserEntity.builder()
                .email(request.getEmail())
                .userId(generatedUserId)
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .status(Status.ACTIVE)
                .isEmailVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
        
        newUserEntity = userRepository.save(newUserEntity);

        // Initialize empty profile based on role
        if (newUserEntity.getRole() == Role.LEARNER) {
            LearnerEntity learnerProfile = LearnerEntity.builder()
                    .userId(newUserEntity.getUserId())
                    .build();
            learnerRepository.save(learnerProfile);
        } else if (newUserEntity.getRole() == Role.INSTITUTION) {
            InstitutionEntity institutionProfile = InstitutionEntity.builder()
                    .userId(newUserEntity.getUserId())
                    .build();
            institutionRepository.save(institutionProfile);
        }

        return convertToUserResponse(newUserEntity);
    }

    @Override
    public java.util.List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    private synchronized String generateNextLearnerId() {
        String prefix = "L2026";
        java.util.Optional<UserEntity> latestUser = userRepository.findFirstByRoleAndUserIdStartingWithOrderByUserIdDesc(Role.LEARNER, prefix);
        
        String candidateId;
        if (latestUser.isEmpty()) {
            candidateId = prefix + "A001";
        } else {
            String lastId = latestUser.get().getUserId();
            if (lastId.length() < 10) {
                candidateId = prefix + "A001";
            } else {
                char letter = lastId.charAt(5); // index 5 is 'A' in "L2026A001"
                int num = Integer.parseInt(lastId.substring(6)); // index 6 onwards is "001"
                
                num++;
                if (num > 999) {
                    letter++;
                    num = 1;
                    if (letter > 'Z') {
                        throw new IllegalStateException("Max learner ID limit reached (Z999)");
                    }
                }
                candidateId = String.format("%s%c%03d", prefix, letter, num);
            }
        }

        // Defensive check: if candidateId already exists in DB, increment until unique
        while (userRepository.existsByUserId(candidateId)) {
            char letter = candidateId.charAt(5);
            int num = Integer.parseInt(candidateId.substring(6));
            num++;
            if (num > 999) {
                letter++;
                num = 1;
            }
            candidateId = String.format("%s%c%03d", prefix, letter, num);
        }

        return candidateId;
    }

    @Override
    public com.credencify.auth_service.dto.UserProfileResponse getUserProfileByUserId(String userId) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        com.credencify.auth_service.dto.UserProfileResponse.UserProfileResponseBuilder builder =
                com.credencify.auth_service.dto.UserProfileResponse.builder()
                        .id(user.getId())
                        .userId(user.getUserId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .isEmailVerified(user.getIsEmailVerified());

        if (user.getRole() == Role.LEARNER) {
            learnerRepository.findByUserId(userId).ifPresent(l -> {
                builder.dob(l.getDob())
                       .gender(l.getGender())
                       .phoneNumber(l.getPhoneNumber())
                       .address(l.getAddress())
                       .city(l.getCity())
                       .state(l.getState())
                       .country(l.getCountry())
                       .postalCode(l.getPostalCode())
                       .profileImageUrl(l.getProfileImageUrl());
            });
        } else if (user.getRole() == Role.INSTITUTION) {
            institutionRepository.findByUserId(userId).ifPresent(inst -> {
                builder.institutionCode(inst.getInstitutionCode())
                       .registrationNumber(inst.getRegistrationNumber())
                       .contactNumber(inst.getContactNumber())
                       .websiteUrl(inst.getWebsiteUrl())
                       .logoUrl(inst.getLogoUrl())
                       .address(inst.getAddress());
            });
        }

        return builder.build();
    }

    @Override
    public com.credencify.auth_service.dto.UserProfileResponse updateUserProfile(String userId, com.credencify.auth_service.dto.UpdateProfileRequest request) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail().trim());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        // Update profile sub-entity based on role
        if (user.getRole() == Role.LEARNER) {
            LearnerEntity learner = learnerRepository.findByUserId(userId)
                    .orElseGet(() -> LearnerEntity.builder().userId(userId).build());

            if (request.getDob() != null && !request.getDob().isBlank()) {
                try { learner.setDob(java.time.LocalDate.parse(request.getDob())); } catch (Exception ignored) {}
            }
            if (request.getGender() != null) learner.setGender(request.getGender());
            if (request.getPhoneNumber() != null) learner.setPhoneNumber(request.getPhoneNumber());
            if (request.getAddress() != null) learner.setAddress(request.getAddress());
            if (request.getCity() != null) learner.setCity(request.getCity());
            if (request.getState() != null) learner.setState(request.getState());
            if (request.getCountry() != null) learner.setCountry(request.getCountry());
            if (request.getPostalCode() != null) learner.setPostalCode(request.getPostalCode());
            if (request.getProfileImageUrl() != null) learner.setProfileImageUrl(request.getProfileImageUrl());

            learnerRepository.save(learner);
        } else if (user.getRole() == Role.INSTITUTION) {
            InstitutionEntity inst = institutionRepository.findByUserId(userId)
                    .orElseGet(() -> InstitutionEntity.builder().userId(userId).build());

            if (request.getInstitutionCode() != null) inst.setInstitutionCode(request.getInstitutionCode());
            if (request.getRegistrationNumber() != null) inst.setRegistrationNumber(request.getRegistrationNumber());
            if (request.getContactNumber() != null) inst.setContactNumber(request.getContactNumber());
            if (request.getWebsiteUrl() != null) inst.setWebsiteUrl(request.getWebsiteUrl());
            if (request.getLogoUrl() != null) inst.setLogoUrl(request.getLogoUrl());
            if (request.getAddress() != null) inst.setAddress(request.getAddress());

            institutionRepository.save(inst);
        }

        return getUserProfileByUserId(userId);
    }

    private RegisterResponse convertToUserResponse(UserEntity newUserEntity) {
        return RegisterResponse.builder()
                    .fullName(newUserEntity.getFullName())
                    .email(newUserEntity.getEmail())
                    .userId(newUserEntity.getUserId())
                    .isEmailVerified(newUserEntity.getIsEmailVerified())
                    .build();
    }
}
