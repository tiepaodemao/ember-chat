package com.ww.websocket.model;

public class User {
    private String name;
    private String imageUrl;

    public User(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
