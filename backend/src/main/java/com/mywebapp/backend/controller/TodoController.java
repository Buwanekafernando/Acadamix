package com.mywebapp.backend.controller;

import com.mywebapp.backend.entity.Todo;
import com.mywebapp.backend.entity.User;
import com.mywebapp.backend.repository.UserRepository;
import com.mywebapp.backend.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getTodos(Principal principal) {
        User user = getCurrentUser(principal);
        if (user == null) return ResponseEntity.status(401).body("User not authenticated");
        return ResponseEntity.ok(todoService.getTodos(user));
    }

    @PostMapping
    public ResponseEntity<?> createTodo(@RequestBody Map<String, String> body, Principal principal) {
        User user = getCurrentUser(principal);
        if (user == null) return ResponseEntity.status(401).body("User not authenticated");
        return ResponseEntity.ok(todoService.createTodo(user, body.get("task")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(todoService.updateTodo(id, body.get("isCompleted")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok().build();
    }
}
