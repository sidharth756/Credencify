package com.credencify.blockchainservice.dto.response.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreHashResponse {
    private Boolean success;
    private String message;
    private String transactionHash;
    private Long blockNumber;
}
