package com.ww.websocket.model;

import lombok.Data;

@Data
public class User {
    private String name;
    private String imageUrl;

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    public User(String name, String imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }
}
