import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import '../styles/Todo.css';

function Todo() {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');
    const token = localStorage.getItem('token');

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/todos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        try {
            const response = await axios.post('http://localhost:8080/api/todos', 
                { task: newTask },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos([response.data, ...todos]);
            setNewTask('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id, isCompleted) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/todos/${id}`, 
                { isCompleted: !isCompleted },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos(todos.map(t => t.id === id ? response.data : t));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(todos.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    useEffect(() => {
        if (token) fetchTodos();
    }, [token]);

    return (
        <div className="todo-container">
            <h2 className="todo-header">My Tasks</h2>
            <form className="todo-form" onSubmit={addTodo}>
                <input 
                    className="todo-input"
                    type="text" 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                    placeholder="Add a new task..." 
                />
                <button className="todo-btn" type="submit">Add</button>
            </form>
            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id} className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
                        <input 
                            type="checkbox" 
                            className="todo-checkbox"
                            checked={todo.isCompleted} 
                            onChange={() => toggleTodo(todo.id, todo.isCompleted)} 
                        />
                        <span>{todo.task}</span>
                        <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                            <Trash2 size={20} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todo;
