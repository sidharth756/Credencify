package com.credencify.auth_service.service;

import com.credencify.auth_service.dto.InstitutionRequest;
import com.credencify.auth_service.dto.InstitutionResponse;

import java.util.List;

public interface InstitutionService {

    List<InstitutionResponse> getAllInstitutions();

    InstitutionResponse getInstitutionByUserId(String userId);

    InstitutionResponse saveInstitution(InstitutionRequest request);

    void deleteInstitutionByUserId(String userId);

    InstitutionResponse updateInstitutionByUserId(
            String userId,
            InstitutionRequest request
    );
}