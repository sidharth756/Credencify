package com.credencify.verificationservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String certificateId;

    private String uploadedFileName;

    @Column(nullable = false)
    private LocalDateTime auditedAt;

    private int matchScore; // 0-100

    @Column(nullable = false)
    private String verdict; // AUTHENTIC, MISMATCH, TAMPERED

    @Column(columnDefinition = "TEXT")
    private String anomalies; // JSON string of anomaly list

    private String extractedName;
    private String extractedCourse;
    private String extractedInstitution;
}
