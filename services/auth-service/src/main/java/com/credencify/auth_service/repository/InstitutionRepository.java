package com.credencify.auth_service.repository;

import com.credencify.auth_service.entity.InstitutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<InstitutionEntity, Long> {
    Optional<InstitutionEntity> findByUserId(String userId);
    Boolean existsByUserId(String userId);
}
