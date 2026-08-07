package com.credencify.blockchainservice.dto.response.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifyHashResponse {
    private String certificateId;
    private String hash;
}
