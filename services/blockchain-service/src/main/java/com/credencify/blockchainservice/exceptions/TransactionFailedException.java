package com.credencify.blockchainservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TransactionFailedException extends RuntimeException{
    public TransactionFailedException(String message){
        super(message);
    }
}
