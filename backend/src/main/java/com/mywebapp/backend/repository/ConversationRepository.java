package com.mywebapp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mywebapp.backend.entity.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    // Optional: Add custom queries later if needed
}

