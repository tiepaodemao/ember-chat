package com.ww.websocket.model;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.util.Date;

@Data
public class ResultMessage {
    //1上线提醒 2下线提醒 3私发 4群发
    private Integer msgType;
    private String message;
    private User sendUser;
    @JSONField(format="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String receiveUser;

    public ResultMessage() {
    }

    public ResultMessage(Integer msgType, String message) {
        this.msgType = msgType;
        this.message = message;
    }

    public ResultMessage(Integer msgType, String message, User sendUser) {
        this.msgType = msgType;
        this.message = message;
        this.sendUser = sendUser;
    }
}
