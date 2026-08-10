package com.credencify.credential_service.entity;

import com.credencify.credential_service.enums.CertificateStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;



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

    public CertificateEntity(){

    }

    public CertificateEntity(LocalDateTime createdAt, Long id, String certificateId, String courseName, String learnerName, String institutionName, String certificateHash, String transactionHash, CertificateStatus status) {
        this.createdAt = createdAt;
        this.id = id;
        this.certificateId = certificateId;
        this.courseName = courseName;
        this.learnerName = learnerName;
        this.institutionName = institutionName;
        this.certificateHash = certificateHash;
        this.transactionHash = transactionHash;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public String getCertificateHash() {
        return certificateHash;
    }

    public void setCertificateHash(String certificateHash) {
        this.certificateHash = certificateHash;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getLearnerName() {
        return learnerName;
    }

    public void setLearnerName(String learnerName) {
        this.learnerName = learnerName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }
}
