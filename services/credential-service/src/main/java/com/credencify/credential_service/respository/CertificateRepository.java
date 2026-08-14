package com.credencify.credential_service.respository;

import com.credencify.credential_service.entity.CertificateEntity;
import com.credencify.credential_service.enums.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<CertificateEntity, Long> {
    CertificateEntity findByCertificateId(String certificate_id);

    Boolean existsByCertificateId(String certificateId);

    List<CertificateEntity> findByInstitutionId(String institutionId);
    List<CertificateEntity> findByLearnEmail(String learnEmail);
    List<CertificateEntity> findByLearnerId(String learnerId);

    // Admin: recent 5 certificates ordered by date desc
    List<CertificateEntity> findTop5ByOrderByCreatedAtDesc();

    // Admin: all certificates ordered by date desc
    List<CertificateEntity> findAllByOrderByCreatedAtDesc();

    // Admin: top institutions by certificate count (real GROUP BY)
    @Query("SELECT c.institutionName, COUNT(c) as cnt FROM CertificateEntity c " +
           "GROUP BY c.institutionName ORDER BY cnt DESC")
    List<Object[]> findTopInstitutionsByCount();

    // Admin: count by status
    long countByStatus(CertificateStatus status);

    // Admin: daily certificate counts for chart
    @Query("SELECT DATE(c.createdAt) as date, COUNT(c) as cnt FROM CertificateEntity c GROUP BY DATE(c.createdAt) ORDER BY DATE(c.createdAt) ASC")
    List<Object[]> findDailyCertificateCounts();
}
