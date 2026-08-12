package com.credencify.credential_service.entity;

import com.credencify.credential_service.enums.CertificateStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "certificates")
public class CertificateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "certificate_id")
    private String certificateId;
    @Column(name = "course_name")
    private String courseName;
    @Column(name = "learner_name")
    private String learnerName;
    @Column(name = "institution_name")
    private String institutionName;
    @Column(name = "certificate_hash")
    private String certificateHash;
    @Column(name = "transaction_hash")
    private String transactionHash;
    @Column(name = "status",nullable = false)
    private CertificateStatus status = CertificateStatus.ISSUED;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "learner_email")
    private String learnEmail;
    @Column(name = "insititution_id")
    private String institutionId;




}
