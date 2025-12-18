import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Notifications.css';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        if (token) fetchNotifications();
    }, [token]);

    return (
        <div className="notifications-container">
            <h2 className="notif-header">Notifications</h2>
            {notifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No new notifications</p>
            ) : (
                <ul className="notif-list">
                    {notifications.map(notif => (
                        <li key={notif.id} className={`notif-item ${!notif.isRead ? 'unread' : ''}`}>
                            <div className="notif-content">
                                <p>{notif.message}</p>
                                <span className="notif-time">{new Date(notif.createdAt).toLocaleDateString()}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Notifications;
