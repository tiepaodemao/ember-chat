package com.ww.websocket.model;

import lombok.Data;

@Data
public class ResultMessage {
    //0私发 1上线提醒 2下线提醒
    private Integer msgType;
    private String message;
    private User user;

    public ResultMessage() {
    }

    public ResultMessage(Integer msgType, String message) {
        this.msgType = msgType;
        this.message = message;
    }

    public ResultMessage(Integer msgType, String message, User user) {
        this.msgType = msgType;
        this.message = message;
        this.user = user;
    }
}
