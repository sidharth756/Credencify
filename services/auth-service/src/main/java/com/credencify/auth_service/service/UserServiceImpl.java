package com.credencify.auth_service.service;

import com.credencify.auth_service.dto.RegisterRequest;
import com.credencify.auth_service.dto.RegisterResponse;
import com.credencify.auth_service.entity.User;
import com.credencify.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    @Override
    public RegisterResponse createUser(RegisterRequest request) {
        User newUser = convertToUserEntity(request);
        if(!userRepository.existsByEmail(request.getEmail())){
            newUser = userRepository.save(newUser);
            return convertToUserResponse(newUser);

        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email Already Exists");
    }

    private RegisterResponse convertToUserResponse(User newUser) {
        return RegisterResponse.builder()
                    .fullName(newUser.getFullName())
                    .email(newUser.getEmail())
                    .userId(newUser.getUserId())
                    .isEmailVerified(newUser.getIsEmailVerified())
                    .build();
    }

    private User convertToUserEntity(RegisterRequest request){
        return User.builder()
                .email(request.getEmail())
                .userId((UUID.randomUUID().toString()))
                .fullName(request.getFullName())
                .password((request.getPassword()))
                .isEmailVerified(false)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();

    }
}
