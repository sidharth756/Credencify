package com.credencify.auth_service.service;

import com.credencify.auth_service.dto.InstitutionRequest;
import com.credencify.auth_service.dto.InstitutionResponse;
import com.credencify.auth_service.entity.InstitutionEntity;
import com.credencify.auth_service.repository.InstitutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstitutionServiceImpl implements InstitutionService {

    private final InstitutionRepository institutionRepository;

    @Override
    public List<InstitutionResponse> getAllInstitutions() {

        return institutionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public InstitutionResponse getInstitutionByUserId(String userId) {

        InstitutionEntity institution =
                institutionRepository.findByUserId(userId)
                        .orElse(null);

        if (institution == null) {
            return null;
        }

        return toResponse(institution);
    }

    @Override
    public InstitutionResponse saveInstitution(
            InstitutionRequest request) {

        if (institutionRepository.existsByUserId(request.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Institution profile already exists for this user ID"
            );
        }

        if (request.getInstitutionCode() != null &&
                institutionRepository.existsByInstitutionCode(
                        request.getInstitutionCode())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Institution code already exists"
            );
        }

        InstitutionEntity institution = toEntity(request);

        institution.setIsApproved(false);

        InstitutionEntity savedInstitution =
                institutionRepository.save(institution);

        return toResponse(savedInstitution);
    }

    @Override
    @Transactional
    public void deleteInstitutionByUserId(String userId) {

        if (!institutionRepository.existsByUserId(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Institution not found for user ID: " + userId
            );
        }

        institutionRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional
    public InstitutionResponse updateInstitutionByUserId(
            String userId,
            InstitutionRequest request) {

        InstitutionEntity existingInstitution =
                institutionRepository.findByUserId(userId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Institution not found for user ID: " + userId
                        ));

        existingInstitution.setInstitutionCode(
                request.getInstitutionCode());

        existingInstitution.setInstitutionType(
                request.getInstitutionType());

        existingInstitution.setRegNo(
                request.getRegNo());

        existingInstitution.setWebsiteUrl(
                request.getWebsiteUrl());

        existingInstitution.setAddress(
                request.getAddress());

        existingInstitution.setCity(
                request.getCity());

        existingInstitution.setState(
                request.getState());

        existingInstitution.setCountry(
                request.getCountry());

        existingInstitution.setPostalCode(
                request.getPostalCode());

        existingInstitution.setLogoUrl(
                request.getLogoUrl());

        InstitutionEntity updatedInstitution =
                institutionRepository.save(existingInstitution);

        return toResponse(updatedInstitution);
    }

    private InstitutionEntity toEntity(InstitutionRequest request) {

        return InstitutionEntity.builder()
                .userId(request.getUserId())
                .institutionCode(request.getInstitutionCode())
                .institutionType(request.getInstitutionType())
                .regNo(request.getRegNo())
                .websiteUrl(request.getWebsiteUrl())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .logoUrl(request.getLogoUrl())
                .isApproved(false)
                .build();
    }

    private InstitutionResponse toResponse(
            InstitutionEntity institution) {

        return InstitutionResponse.builder()
                .id(institution.getId())
                .userId(institution.getUserId())
                .institutionCode(institution.getInstitutionCode())
                .institutionType(institution.getInstitutionType())
                .regNo(institution.getRegNo())
                .websiteUrl(institution.getWebsiteUrl())
                .address(institution.getAddress())
                .city(institution.getCity())
                .state(institution.getState())
                .country(institution.getCountry())
                .postalCode(institution.getPostalCode())
                .logoUrl(institution.getLogoUrl())
                .isApproved(institution.getIsApproved())
                .approvedAt(institution.getApprovedAt())
                .build();
    }
}