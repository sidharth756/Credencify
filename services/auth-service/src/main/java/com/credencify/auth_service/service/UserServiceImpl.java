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
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LearnerRepository learnerRepository;
    private final InstitutionRepository institutionRepository;


    @Override
    public RegisterResponse createUser(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email Already Exists");
        }
        
        UserEntity newUserEntity = convertToUserEntity(request);
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

    private RegisterResponse convertToUserResponse(UserEntity newUserEntity) {
        return RegisterResponse.builder()
                    .fullName(newUserEntity.getFullName())
                    .email(newUserEntity.getEmail())
                    .userId(newUserEntity.getUserId())
                    .isEmailVerified(newUserEntity.getIsEmailVerified())
                    .build();
    }

    private UserEntity convertToUserEntity(RegisterRequest request){
        return UserEntity.builder()
                .email(request.getEmail())
                .userId((UUID.randomUUID().toString()))
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .status(Status.ACTIVE)
                .isEmailVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();

    }
}
