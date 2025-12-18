import React, { useState, useEffect } from 'react';
import '../styles/UserProfile.css';
import {
  MessageSquare,
  Bell,
  Bot,
  Folder,
  ListTodo,
  PencilLine,
  UserCircle
} from 'lucide-react';
import logo from '../assets/logo.png';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    name: '',
    bio: '',
    profileImageUrl: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ posts: 0, todos: 0, completedTodos: 0 });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!username || !token) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/search?query=${encodeURIComponent(username)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const users = await response.json();
          const foundUser = users.find(u => u.username === username);
          if (foundUser) {
            setUser(foundUser);
            setFormData({
              name: foundUser.name || '',
              bio: foundUser.bio || '',
              name: foundUser.name || '',
              bio: foundUser.bio || '',
              profileImageUrl: foundUser.profileImageUrl || ''
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };

    fetchUser();

    // Fetch stats
    const fetchStats = async () => {
      try {
        const postsRes = await fetch('http://localhost:8080/api/posts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (postsRes.ok) {
          const posts = await postsRes.json();
          setStats(prev => ({ ...prev, posts: posts.length }));
        }

        const todosRes = await fetch('http://localhost:8080/api/todos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (todosRes.ok) {
          const todos = await todosRes.json();
          setStats(prev => ({
            ...prev,
            todos: todos.length,
            completedTodos: todos.filter(t => t.isCompleted).length
          }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [username, token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleUpdate = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': user.id.toString()
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to update profile');
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccessMsg('Profile updated successfully');
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'userId': user.id.toString()
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Incorrect password. Account deletion cancelled.');
        } else {
          throw new Error('Failed to delete account.');
        }
      }
      alert('Account deleted successfully.');
      navigate('/login');
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>User not found or loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="sidebar">
        <img src={logo} alt="Academix Logo" className="logo" />
        <div className="sidebar-icons">
          <MessageSquare />
          <ListTodo />
          <Bell />
          <Bot />
          <Folder />
          <PencilLine />
          <UserCircle />
        </div>
      </div>

      <div className="profile-left">
        <img src={user.profileImageUrl || 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/corporate-user-icon.png'} alt="User" className="profile-image" />
      </div>

      <div className="profile-right">
        <h2 className="profile-header">{user.username}</h2>

        <div className="bio-card">
          <h3>Bio</h3>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            placeholder="Write your bio here"
            disabled={isLoading}
          />
        </div>

        <div className="bio-card">
          <h3>Activity Stats</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <strong>Posts:</strong> {stats.posts}
            </div>
            <div>
              <strong>Tasks:</strong> {stats.completedTodos} / {stats.todos}
            </div>
          </div>
        </div>

        <div className="additional-info">
          <p><strong>Name:</strong></p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <p><strong>Profile Image URL:</strong></p>
          <input
            type="text"
            name="profileImageUrl"
            value={formData.profileImageUrl}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}

        <button onClick={handleUpdate} disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Details'}
        </button>

        <button className="delete-button" onClick={handleDelete} disabled={isLoading}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
