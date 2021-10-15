package com.ww.websocket.model;

/**
 * 浏览器发送给服务器的websocket数据.
 */

public class Message {
    /** 接收方*/
    private String toName;
    /** 发送的数据 */
    private String message;


    public Message() {
    }

    public Message(String toName, String message) {
        this.toName = toName;
        this.message = message;
    }

    public String getToName() {
        return toName;
    }

    public void setToName(String toName) {
        this.toName = toName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
