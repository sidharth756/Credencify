package com.credencify.verificationservice.service;

import com.credencify.verificationservice.dto.response.VerifyHashResponse;

public interface VerificationService {
    VerifyHashResponse verify(String certificateId) throws Exception;
}
