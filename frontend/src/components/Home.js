import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { MessageSquare, MessageCircle, Bell, Bot, Folder, TimerReset, Upload, ListTodo, PencilLine, Plus, UserCircle, } from 'lucide-react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostFeed from './PostFeed';
import { motion } from 'motion/react';
import { fadeIn, slideUp, staggerContainer, hoverScale } from '../utils/animations';

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
      <motion.div
        className="sidebar glass-panel"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <img src={logo} alt="Logo" className="logo-image" />
        <div className="sidebar-icons">
          {[
            { icon: MessageCircle, action: handleChatClick },
            { icon: ListTodo, action: () => navigate('/todo') },
            { icon: Bell, action: () => navigate('/notifications') },
            { icon: Bot, action: () => navigate('/bot') },
            { icon: Folder, action: handleFileClick }
          ].map((item, index) => (
            <motion.button
              key={index}
              className="icon-btn"
              onClick={item.action}
              whileHover={{ scale: 1.2, color: 'var(--primary-color)' }}
              whileTap={{ scale: 0.9 }}
            >
              <item.icon size={24} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="main-content">
        <header className="header">
          <motion.h1
            className="quote gradient-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {randomQuote}
          </motion.h1>
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
            <ul className="search-results glass-panel">
              {searchResults.map(user => (
                <li key={user.id}>
                  <span onClick={() => handleUserClick(user.username)} style={{ cursor: 'pointer', color: 'var(--primary-color)' }}>
                    {user.username} ({user.name || 'No name'})
                  </span>
                  <button onClick={() => handleFollowClick(user.id)} className="btn-small">Follow</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <motion.div
          className="content-area"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="left-section">
            <PostFeed />
          </div>

          <motion.div className="right-section" variants={slideUp}>
            <motion.div className="card glass-panel" whileHover={hoverScale}>
              <h3>Welcome</h3>
            </motion.div>

            {[
              { title: "TO DO LIST", icon: ListTodo, action: () => navigate('/todo'), btnText: "Open" },
              { title: "Timer", icon: TimerReset, action: () => navigate('/timer'), btnText: "Start" },
              { title: "Document Hub", icon: Upload, action: () => navigate('/filesharing'), btnText: "Access" },
              { title: "Chatbox", icon: MessageSquare, action: handleChatClick, btnText: "Open" }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="card glass-panel"
                variants={slideUp}
                whileHover={hoverScale}
              >
                <h3>{card.title}</h3>
                <button className="action-btn" onClick={card.action}>
                  <card.icon size={18} /> {card.btnText}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
