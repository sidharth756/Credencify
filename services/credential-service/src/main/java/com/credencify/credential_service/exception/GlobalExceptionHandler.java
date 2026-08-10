package com.credencify.credential_service.exception;


import feign.Feign;
import feign.FeignException;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    Feign feign;
    @ExceptionHandler(HashNotFoundException.class)
    public ResponseEntity<String> handleHashNotFound(HashNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(HashMismatchException.class)
    public ResponseEntity<String> handleHashMismatch(HashMismatchException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<String> handleFeignNotFound(FeignException.NotFound ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not Found on Microservice" + ex.contentUTF8());
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<String> handleGenericFeignException(FeignException ex){
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Downsteam Communication failed");
    }

    @ExceptionHandler(FeignException.Conflict.class)
    public ResponseEntity<String> handleFeignConflict(FeignException.Conflict ex){
        return ResponseEntity.status(HttpStatus.CONFLICT).body("This certificate ID has already been registered on the blockchain.");
    }

}
