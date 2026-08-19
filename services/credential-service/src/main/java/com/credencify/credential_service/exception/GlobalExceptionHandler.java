package com.credencify.credential_service.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HashNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleHashNotFound(HashNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", true, "message", ex.getMessage()));
    }

    @ExceptionHandler(HashMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleHashMismatch(HashMismatchException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", true, "message", ex.getMessage()));
    }

    @ExceptionHandler(CertifcateNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleCertificateNotFound(CertifcateNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", true, "message", ex.getMessage()));
    }

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<Map<String, Object>> handleFeignNotFound(FeignException.NotFound ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", true, "message", "Certificate hash not found on blockchain."));
    }

    @ExceptionHandler(FeignException.Conflict.class)
    public ResponseEntity<Map<String, Object>> handleFeignConflict(FeignException.Conflict ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", true, "message", "This Certificate ID already exists on the blockchain. Use a unique ID."));
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Map<String, Object>> handleFeignGeneric(FeignException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("error", true, "message", "Downstream blockchain service connection failed."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", true, "message", "An unexpected error occurred: " + ex.getMessage()));
    }
}
