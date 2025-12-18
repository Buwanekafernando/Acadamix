package com.mywebapp.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_one_id", nullable = false)
    private User userOne;
    
    @ManyToOne
    @JoinColumn(name = "user_two_id", nullable = false)
    private User userTwo;
    

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getConversationId() {
        return id;
    }

    public void setConversationId(Long conversationId) {
        this.id = conversationId;
    }

    public User getUserOne() {
        return userOne;
    }
    public void setUserOne(User userOne) {
        this.userOne = userOne;
    }
    
    public User getUserTwo() {
        return userTwo;
    }
    public void setUserTwo(User userTwo) {
        this.userTwo = userTwo;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
