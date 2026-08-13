package com.credencify.credential_service.respository;

import com.credencify.credential_service.entity.CertificateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<CertificateEntity,Long> {
    CertificateEntity findByCertificateId(String certificate_id);

    Boolean existsByCertificateId(String certificateId);
}
