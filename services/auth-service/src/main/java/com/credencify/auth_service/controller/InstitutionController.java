package com.credencify.auth_service.controller;

import com.credencify.auth_service.dto.InstitutionRequest;
import com.credencify.auth_service.dto.InstitutionResponse;
import com.credencify.auth_service.service.InstitutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/institutions")
@RequiredArgsConstructor
public class InstitutionController {
    private final InstitutionService institutionService;

    @GetMapping
    public ResponseEntity<List<InstitutionResponse>> getAllInstitutions() {
        return ResponseEntity.ok( institutionService.getAllInstitutions()
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<InstitutionResponse> getInstitutionByUserId(
            @PathVariable String userId) {

        InstitutionResponse institution =  institutionService.getInstitutionByUserId(userId);
        if (institution == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(institution);
    }

    @PostMapping
    public ResponseEntity<InstitutionResponse> saveInstitution(
            @Valid @RequestBody InstitutionRequest request) {
        InstitutionResponse savedInstitution = institutionService.saveInstitution(request);
        return ResponseEntity.ok(savedInstitution);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteInstitution(
            @PathVariable String userId) {
        institutionService.deleteInstitutionByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<InstitutionResponse> updateInstitution(
            @PathVariable String userId,
            @Valid @RequestBody InstitutionRequest request) {

        InstitutionResponse updatedInstitution =  institutionService.updateInstitutionByUserId(
                        userId, request
                );
        return ResponseEntity.ok(updatedInstitution);
    }
}