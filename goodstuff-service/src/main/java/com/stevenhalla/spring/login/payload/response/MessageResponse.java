package com.stevenhalla.spring.login.payload.response;

import com.stevenhalla.spring.login.controllers.AuthController;

public class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
