package com.mywebapp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.mywebapp.backend.entity.Message;
import com.mywebapp.backend.service.MessageService;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Message message) {
        Message savedMessage = messageService.createMessage(message);
        messagingTemplate.convertAndSend(
            "/topic/conversation." + message.getConversation().getId(),
            savedMessage
        );
    }
} 