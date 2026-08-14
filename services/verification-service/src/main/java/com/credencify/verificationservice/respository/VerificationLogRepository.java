package com.credencify.verificationservice.respository;

import com.credencify.verificationservice.entity.VerificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationLogRepository extends JpaRepository<VerificationLog, Long> {
    List<VerificationLog> findAllByOrderByVerifiedAtDesc();
}
