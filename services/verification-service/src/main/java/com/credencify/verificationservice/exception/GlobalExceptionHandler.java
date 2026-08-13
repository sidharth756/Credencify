package com.credencify.verificationservice.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<String> handleFeignNotFound(FeignException.NotFound ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found on Microservices " + ex.getMessage());
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<String> handleFeignGeneric(FeignException ex){
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Downstream connection failed");
    }

    @ExceptionHandler(CertifcateNotFoundException.class)
    public ResponseEntity<String> handleCertificateNotFound(CertifcateNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
