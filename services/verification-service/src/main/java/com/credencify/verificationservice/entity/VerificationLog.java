package com.credencify.verificationservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_log")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String certificateId;

    @Column(nullable = false)
    private String status; // VERIFIED, NOT_FOUND, BLOCKCHAIN_MISMATCH

    @Column(columnDefinition = "TEXT")
    private String blockchainHash;

    private String verifierIp;

    @Column(nullable = false)
    private LocalDateTime verifiedAt;
}
