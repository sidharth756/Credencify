package com.credencify.auth_service.repository;

import com.credencify.auth_service.entity.InstitutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstitutionRepository extends JpaRepository<InstitutionEntity, Long> {
    Optional<InstitutionEntity> findByUserId(String userId);
    Boolean existsByUserId(String userId);
    Boolean existsByInstitutionCode(String institutionCode);
    void deleteByUserId(String userId);
}