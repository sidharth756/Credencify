package com.credencify.auth_service.repository;

import com.credencify.auth_service.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {

    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByUserId(String userId);
    Boolean existsByEmail(String email);
    Boolean existsByUserId(String userId);
    Optional<UserEntity> findFirstByRoleAndUserIdStartingWithOrderByUserIdDesc(com.credencify.auth_service.enums.Role role, String prefix);
}
