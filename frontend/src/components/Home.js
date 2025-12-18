import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { MessageSquare, MessageCircle, Bell, Bot, Folder, TimerReset, Upload, ListTodo, PencilLine, Plus, UserCircle, } from 'lucide-react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostFeed from './PostFeed';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from localStorage or other storage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChatClick = () => {
    navigate('/chatbox');
  };

  const handleFileClick = () => {
    navigate('/filesharing');
  };

  const quotes = [
    "The only impossible journey is the one you never begin.",
    "Success is not final, failure is not fatal.",
    "Believe you can and you're halfway there."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const users = await response.json();
        setSearchResults(users);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleFollowClick = async (userId) => {
    try {
      const response = await fetch(`/api/users/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        alert('Followed user successfully');
        // Optionally update UI or refresh search results
      } else {
        alert('Failed to follow user');
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('Error following user');
    }
  };

  return (
    <div className="home-wrapper">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo-image" />
        <button className="icon-btn" onClick={handleChatClick}><MessageCircle size={24} /></button>
        <button className="icon-btn" onClick={() => navigate('/todo')}><ListTodo size={24} /></button>
        <button className="icon-btn" onClick={() => navigate('/notifications')}><Bell size={24} /></button>
        <button className="icon-btn" onClick={() => navigate('/bot')}><Bot size={24} /></button>
        <button className="icon-btn" onClick={handleFileClick}><Folder size={24} /></button>
      </div>

      <div className="main-content">
        <header className="header">
          <h1 className="quote">{randomQuote}</h1>
          <div className="profile-icon" onClick={() => navigate(user ? `/profile/${user.username}` : '/login')}>
            <UserCircle size={32} style={{ cursor: 'pointer' }} />
          </div>
        </header>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map(user => (
                <li key={user.id}>
                  <span onClick={() => handleUserClick(user.username)} style={{ cursor: 'pointer', color: 'blue' }}>
                    {user.username} ({user.name || 'No name'})
                  </span>
                  <button onClick={() => handleFollowClick(user.id)}>Follow</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="content-area">
          <div className="left-section">
            <div className="post-header">
              {/* Removed buttons as PostFeed handles creation */}
            </div>
            <PostFeed />
          </div>

          <div className="right-section">
            <div className="card">
              <h3>Welcome</h3>
            </div>
            <div className="card">
              <h3>TO DO LIST</h3>
              <button className="action-btn" onClick={() => navigate('/todo')}><ListTodo size={18} /> Open</button>
            </div>
            <div className="card">
              <h3>Timer</h3>
              <button className="action-btn" onClick={() => navigate('/timer')}><TimerReset size={18} /> Start</button>
            </div>
            <div className="card">
              <h3>Document Hub</h3>
              <button className="action-btn" onClick={() => navigate('/filesharing')}><Upload size={18} /> Access</button>
            </div>
            <div className="card">
              <h3>Chatbox</h3>
              <button className="action-btn" onClick={handleChatClick}><MessageSquare size={18} /> Open</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
