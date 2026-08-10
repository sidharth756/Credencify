package com.credencify.credential_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class HashMismatchException extends RuntimeException{
    public HashMismatchException(String message){
        super(message);
    }
}
