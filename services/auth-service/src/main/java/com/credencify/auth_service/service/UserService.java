package com.credencify.auth_service.service;

import com.credencify.auth_service.dto.RegisterRequest;
import com.credencify.auth_service.dto.RegisterResponse;
import com.credencify.auth_service.entity.User;

public interface UserService {
    RegisterResponse createUser(RegisterRequest request);

}
