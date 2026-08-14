package com.credencify.auth_service.config;

import com.credencify.auth_service.entity.UserEntity;
import com.credencify.auth_service.enums.Role;
import com.credencify.auth_service.enums.Status;
import com.credencify.auth_service.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String adminEmail = "admin@credencify.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            UserEntity admin = UserEntity.builder()
                    .email(adminEmail)
                    .userId("ADMIN-001")
                    .fullName("System Administrator")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ADMIN)
                    .status(Status.ACTIVE)
                    .isEmailVerified(true)
                    .resetOtp(null)
                    .resetOtpExpireAt(0L)
                    .verifyOtp(null)
                    .verifyOtpExpireAt(0L)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin account seeded successfully: admin@credencify.com / password");
        }
    }
}
