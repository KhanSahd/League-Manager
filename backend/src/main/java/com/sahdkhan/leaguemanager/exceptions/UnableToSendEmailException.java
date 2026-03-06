package com.sahdkhan.leaguemanager.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
public class UnableToSendEmailException extends RuntimeException
{
    public UnableToSendEmailException(String msg) {
        super(msg);
    }
}
