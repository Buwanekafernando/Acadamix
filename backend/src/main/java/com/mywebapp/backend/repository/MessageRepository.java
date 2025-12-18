package com.mywebapp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mywebapp.backend.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Fetch all messages by conversation ID
    List<Message> findByConversationId(Long conversationId);
}