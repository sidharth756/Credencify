package com.credencify.credential_service.exception;

public class CertifcateNotFoundException extends  RuntimeException{
    public CertifcateNotFoundException(String message){
        super(message);
    }
}
