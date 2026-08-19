package com.credencify.auth_service.controller;

import com.credencify.auth_service.dto.RegisterRequest;
import com.credencify.auth_service.dto.RegisterResponse;
import com.credencify.auth_service.repository.UserRepository;
import com.credencify.auth_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.credencify.auth_service.entity.UserEntity;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request){
        RegisterResponse response =  userService.createUser(request);
        //TODO: send welcome email
        return response;
    }

    @GetMapping("/users")
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/profile/{userId}")
    public com.credencify.auth_service.dto.UserProfileResponse getProfile(@PathVariable String userId) {
        return userService.getUserProfileByUserId(userId);
    }

    @PutMapping("/profile/{userId}")
    public com.credencify.auth_service.dto.UserProfileResponse updateProfile(
            @PathVariable String userId,
            @RequestBody com.credencify.auth_service.dto.UpdateProfileRequest request
    ) {
        return userService.updateUserProfile(userId, request);
    }

    @GetMapping("/admin/stats")
    public java.util.Map<String, Object> getAdminStats() {
        List<UserEntity> users = userService.getAllUsers();
        long institutionsCount = users.stream().filter(u -> u.getRole() == com.credencify.auth_service.enums.Role.INSTITUTION).count();
        long learnersCount    = users.stream().filter(u -> u.getRole() == com.credencify.auth_service.enums.Role.LEARNER).count();
        long adminCount       = users.stream().filter(u -> u.getRole() == com.credencify.auth_service.enums.Role.ADMIN).count();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("institutionsCount", institutionsCount);
        stats.put("learnersCount", learnersCount);
        stats.put("adminCount", adminCount);
        stats.put("totalUsers", (long) users.size());
        return stats;
    }
}
