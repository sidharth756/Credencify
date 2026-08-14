package com.credencify.auth_service.service;

import com.credencify.auth_service.dto.RegisterRequest;
import com.credencify.auth_service.dto.RegisterResponse;

public interface UserService {
    RegisterResponse createUser(RegisterRequest request);
    java.util.List<com.credencify.auth_service.entity.UserEntity> getAllUsers();
    com.credencify.auth_service.dto.UserProfileResponse getUserProfileByUserId(String userId);
    com.credencify.auth_service.dto.UserProfileResponse updateUserProfile(String userId, com.credencify.auth_service.dto.UpdateProfileRequest request);
}
