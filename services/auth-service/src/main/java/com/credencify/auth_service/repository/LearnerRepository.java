package com.credencify.auth_service.repository;

import com.credencify.auth_service.entity.LearnerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LearnerRepository extends JpaRepository<LearnerEntity, Long> {
    Optional<LearnerEntity> findByUserId(String userId);
}