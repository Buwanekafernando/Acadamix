package com.mywebapp.backend.service;

import com.mywebapp.backend.entity.Todo;
import com.mywebapp.backend.entity.User;
import com.mywebapp.backend.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getTodos(User user) {
        return todoRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Todo createTodo(User user, String task) {
        Todo todo = new Todo();
        todo.setUser(user);
        todo.setTask(task);
        todo.setCreatedAt(LocalDateTime.now());
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, Boolean isCompleted) {
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
        todo.setIsCompleted(isCompleted);
        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
