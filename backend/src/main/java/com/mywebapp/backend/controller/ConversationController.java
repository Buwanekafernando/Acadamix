package com.mywebapp.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mywebapp.backend.entity.Conversation;
import com.mywebapp.backend.repository.ConversationRepository;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*")
public class ConversationController {

    @Autowired
    private ConversationRepository conversationRepository;

    // GET all conversations
    @GetMapping
    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    // GET conversation by ID
    @GetMapping("/{id}")
    public Conversation getConversationById(@PathVariable Long id) {
        return conversationRepository.findById(id).orElse(null);
    }

    // POST - create a new conversation
    @PostMapping
    public Conversation createConversation(@RequestBody Conversation conversation) {
        conversation.setCreatedAt(LocalDateTime.now());
        return conversationRepository.save(conversation);
    }

    // DELETE - remove a conversation
    @DeleteMapping("/{id}")
    public void deleteConversation(@PathVariable Long id) {
        conversationRepository.deleteById(id);
    }
}
