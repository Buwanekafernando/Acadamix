package com.mywebapp.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mywebapp.backend.entity.Message;
import com.mywebapp.backend.service.MessageService;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/conversation/{id}")
    public ResponseEntity<?> getMessagesByConversationId(@PathVariable Long id) {
        try {
            List<Message> messages = messageService.getMessagesByConversationId(id);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch messages: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createMessage(@RequestBody Message message) {
        try {
            message.setCreatedAt(LocalDateTime.now());
            message.setEdited(false);
            Message savedMessage = messageService.createMessage(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create message: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMessage(
            @PathVariable Long id,
            @RequestBody Message updatedMessage) {
        try {
            Message existingMessage = messageService.getMessageById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

            existingMessage.setContent(updatedMessage.getContent());
            existingMessage.setEdited(true);
            existingMessage.setUpdatedAt(LocalDateTime.now());

            Message savedMessage = messageService.updateMessage(id, existingMessage);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update message: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        try {
            messageService.deleteMessage(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete message: " + e.getMessage()));
        }
    }
}
