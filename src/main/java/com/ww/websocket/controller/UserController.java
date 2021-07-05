package com.ww.websocket.controller;

import com.ww.websocket.model.User;
import com.ww.websocket.ws.ChatEndpoint;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ws")
public class UserController {
    @GetMapping("/getOnLine/{uid}")
    public List<User> getOnLine(@PathVariable("uid")String uid){
        CopyOnWriteArraySet<ChatEndpoint> s = ChatEndpoint.webSocketSet;
        List<User> collect = s.stream().filter(e->!e.getUid().equals(uid)).map(e -> new User(e.getUid())).collect(Collectors.toList());
        return collect;
    }
}
