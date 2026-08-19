package com.credencify.auth_service.controller;

import com.credencify.auth_service.entity.LearnerEntity;
import com.credencify.auth_service.entity.InstitutionEntity;
import com.credencify.auth_service.repository.LearnerRepository;
import com.credencify.auth_service.repository.InstitutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1.0/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final LearnerRepository learnerRepository;
    private final InstitutionRepository institutionRepository;

    @GetMapping("/learner/{userId}")
    public ResponseEntity<LearnerEntity> getLearnerProfile(@PathVariable String userId) {
        LearnerEntity profile = learnerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learner profile not found"));
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/learner")
    public ResponseEntity<LearnerEntity> updateLearnerProfile(@RequestBody LearnerEntity updatedProfile) {
        LearnerEntity existing = learnerRepository.findByUserId(updatedProfile.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learner profile not found"));
        
        // Update fields
        existing.setDob(updatedProfile.getDob());
        existing.setGender(updatedProfile.getGender());
        existing.setPhoneNumber(updatedProfile.getPhoneNumber());
        existing.setAddress(updatedProfile.getAddress());
        existing.setCity(updatedProfile.getCity());
        existing.setState(updatedProfile.getState());
        existing.setCountry(updatedProfile.getCountry());
        existing.setPostalCode(updatedProfile.getPostalCode());
        existing.setProfileImageUrl(updatedProfile.getProfileImageUrl());

        LearnerEntity saved = learnerRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/institution/{userId}")
    public ResponseEntity<InstitutionEntity> getInstitutionProfile(@PathVariable String userId) {
        InstitutionEntity profile = institutionRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Institution profile not found"));
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/institution")
    public ResponseEntity<InstitutionEntity> updateInstitutionProfile(@RequestBody InstitutionEntity updatedProfile) {
        InstitutionEntity existing = institutionRepository.findByUserId(updatedProfile.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Institution profile not found"));
        
        // Update fields
        existing.setInstitutionCode(updatedProfile.getInstitutionCode());
        existing.setRegistrationNumber(updatedProfile.getRegistrationNumber());
        existing.setContactNumber(updatedProfile.getContactNumber());
        existing.setWebsiteUrl(updatedProfile.getWebsiteUrl());
        existing.setLogoUrl(updatedProfile.getLogoUrl());
        existing.setAddress(updatedProfile.getAddress());

        InstitutionEntity saved = institutionRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}
