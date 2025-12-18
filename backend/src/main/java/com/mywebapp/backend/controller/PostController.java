package com.mywebapp.backend.controller;

import com.mywebapp.backend.dto.CommentRequest;
import com.mywebapp.backend.dto.PostRequest;
import com.mywebapp.backend.entity.User;
import com.mywebapp.backend.repository.UserRepository;
import com.mywebapp.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    // Helper to get current user from Principal
    private User getCurrentUser(Principal principal) {
        if (principal == null) return null;
        String email = principal.getName(); // Assuming username/email is the principal name in JWT
        // Fallback for OAuth2User if Principal is not just a string name (depending on config)
         return userRepository.findByEmail(email).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostRequest request, Principal principal) {
        User user = getCurrentUser(principal);
        if (user == null) return ResponseEntity.status(401).body("User not authenticated");
        return ResponseEntity.ok(postService.createPost(user, request));
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts(Principal principal) {
        User user = getCurrentUser(principal);
        // User can be null for public feed, but let's assume private
        return ResponseEntity.ok(postService.getAllPosts(user));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Integer postId, Principal principal) {
        User user = getCurrentUser(principal);
        if (user == null) return ResponseEntity.status(401).body("User not authenticated");
        postService.toggleLike(postId, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(@PathVariable Integer postId, @RequestBody CommentRequest request, Principal principal) {
        User user = getCurrentUser(principal);
        if (user == null) return ResponseEntity.status(401).body("User not authenticated");
        return ResponseEntity.ok(postService.addComment(postId, user, request.getText()));
    }
}
