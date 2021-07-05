package com.ww.websocket.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PageController {
    @GetMapping("/page/{index}")
    public String index(@PathVariable("index")String index){
        return index;
    }
}
