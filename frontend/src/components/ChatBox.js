import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import '../styles/ChatBox.css';

const API_BASE_URL = 'http://localhost:8080';
const WS_URL = 'ws://localhost:8080/ws';

const ChatBox = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        setupWebSocket();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const setupWebSocket = () => {
        wsRef.current = new WebSocket(WS_URL);

        wsRef.current.onopen = () => {
            console.log('WebSocket connected');
        };

        wsRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.conversationId === selectedConversation?.id) {
                setMessages(prev => [...prev, message]);
            }
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Failed to connect to chat server');
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket disconnected');
        };
    };

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/conversations`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch conversations');
            }
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/messages/conversation/${conversationId}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    conversationId: selectedConversation.id,
                    content: newMessage.trim()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const message = await response.json();
            setMessages(prev => [...prev, message]);
            setNewMessage('');
        } catch (error) {
            setError(error.message);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="chatbox-container">
            <div className="chatbox-sidebar">
                <div className="chatbox-header">
                    <h2>Conversations</h2>
                </div>
                <div className="conversations-list">
                    {conversations.map(conversation => (
                        <div
                            key={conversation.id}
                            className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                            onClick={() => setSelectedConversation(conversation)}
                        >
                            <div className="conversation-avatar">
                                {conversation.participants[0]?.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="conversation-info">
                                <h3>{conversation.participants[0]?.username}</h3>
                                <p>{conversation.lastMessage?.content || 'No messages yet'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chatbox-main">
                {selectedConversation ? (
                    <>
                        <div className="chatbox-header">
                            <div className="chat-header-info">
                                <div className="chat-avatar">
                                    {selectedConversation.participants[0]?.username.charAt(0).toUpperCase()}
                                </div>
                                <h2>{selectedConversation.participants[0]?.username}</h2>
                            </div>
                        </div>

                        <div className="messages-container">
                            {messages.map(message => (
                                <div
                                    key={message.id}
                                    className={`message ${message.sender.id === 'current-user-id' ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        <p>{message.content}</p>
                                        <span className="message-time">
                                            {new Date(message.createdAt).toLocaleTimeString()}
                                            {message.isEdited && ' (edited)'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="message-input-form" onSubmit={sendMessage}>
                            <button type="button" className="icon-button">
                                <Paperclip size={20} />
                            </button>
                            <button type="button" className="icon-button">
                                <Smile size={20} />
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="message-input"
                            />
                            <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-conversation-selected">
                        <h2>Select a conversation to start chatting</h2>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
