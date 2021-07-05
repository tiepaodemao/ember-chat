package com.ww.websocket.ws;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.ww.websocket.model.Message;
import com.ww.websocket.model.ResultMessage;
import com.ww.websocket.model.User;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/chat/{uid}")
@Component
public class ChatEndpoint {
    public static CopyOnWriteArraySet<ChatEndpoint> webSocketSet = new CopyOnWriteArraySet<ChatEndpoint>();

    Session session;

    String uid;

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("uid") String uid){
//        Map<String, List<String>> requestParameterMap = session.getRequestParameterMap();
//        Map<String, String> pathParameters = session.getPathParameters();
//        Set<MessageHandler> messageHandlers = session.getMessageHandlers();
//        String id = session.getId();
//        String queryString = session.getQueryString();
//        URI requestURI = session.getRequestURI();
//        int maxTextMessageBufferSize = session.getMaxTextMessageBufferSize();
//        WebSocketContainer container = session.getContainer();
        boolean open = session.isOpen();
        boolean secure = session.isSecure();
        this.session = session;
        this.uid = uid;
        User user = new User(uid);
        sendAllMessage(new ResultMessage(1,this.uid+"已上线了",user));
        webSocketSet.add(this);
    }

    @OnMessage
    public void onMessage(String message,Session session){
        ObjectMapper objectMapper = new ObjectMapper();
        Message msg = null;
        try {
            msg = objectMapper.readValue(message, Message.class);
        } catch (JsonProcessingException e) {
            System.out.println("接收客户端的消息，转换出错了！");
            e.printStackTrace();
        }
        for (ChatEndpoint chatEndpoint : webSocketSet) {
            if (chatEndpoint.uid.equals(msg.getToName())) {
                try {
                    chatEndpoint.sendMessage(new ResultMessage(0,msg.getMessage(),new User(uid)));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void sendAllMessage(ResultMessage resultMessage){
        for (ChatEndpoint chatEndpoint : webSocketSet) {
            try {
                chatEndpoint.sendMessage(resultMessage);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void sendMessage(ResultMessage resultMessage) throws IOException {
        String s = JSON.toJSONString(resultMessage);
        this.session.getBasicRemote().sendText(s);
    }

    @OnClose
    public void onClose(Session session){
        webSocketSet.remove(this);
        this.sendAllMessage(new ResultMessage(2,uid+"下线了",new User(uid)));
    }

    @OnError
    public void onError(Throwable e){

    }
}