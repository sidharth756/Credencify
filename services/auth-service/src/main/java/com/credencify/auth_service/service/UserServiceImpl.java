package com.credencify.auth_service.service;

import com.credencify.auth_service.dto.RegisterRequest;
import com.credencify.auth_service.dto.RegisterResponse;
import com.credencify.auth_service.entity.UserEntity;
import com.credencify.auth_service.repository.UserRepository;
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


    @Override
    public RegisterResponse createUser(RegisterRequest request) {
        UserEntity newUserEntity = convertToUserEntity(request);
        if(!userRepository.existsByEmail(request.getEmail())){
            newUserEntity = userRepository.save(newUserEntity);
            return convertToUserResponse(newUserEntity);

        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email Already Exists");
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
                .isEmailVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();

    }
}
