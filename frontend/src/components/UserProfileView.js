import React, { useState, useEffect } from 'react';
import '../styles/UserProfile.css'; // reuse the same stylesheet
import {
  MessageSquare,
  ListTodo,
  Bell,
  Bot,
  Folder,
  PencilLine,
  UserCircle
} from 'lucide-react';
import logo from '../assets/logo.png';
import { useParams } from 'react-router-dom';

const UserProfileView = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

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
        const response = await fetch(`/api/users/search?query=${encodeURIComponent(username)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const users = await response.json();
          const foundUser = users.find(u => u.username === username);
          if (foundUser) {
            setUser(foundUser);
            // TODO: fetch if current user is following this user
            setIsFollowing(false); // default false, implement actual check if needed
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
  }, [username, token]);

  const handleFollowClick = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/users/${isFollowing ? 'unfollow' : 'follow'}/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setIsFollowing(!isFollowing);
        alert(`${isFollowing ? 'Unfollowed' : 'Followed'} user successfully`);
      } else {
        alert('Failed to update follow status');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      alert('Error updating follow status');
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
        <button className="follow-btn" onClick={handleFollowClick}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>

      <div className="profile-right">
        <h2 className="profile-header">{user.username}</h2>

        <div className="bio-card">
          <h3>Bio</h3>
          <p>
            {user.bio ? user.bio.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            )) : 'No bio available'}
          </p>
        </div>

        <div className="info">
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>Country:</strong> {user.country || 'N/A'}</p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <p>Followers</p>
            <span>{user.followersCount || 0}</span>
          </div>
          <div className="stat-card">
            <p>Following</p>
            <span>{user.followingCount || 0}</span>
          </div>
          <div className="stat-card">
            <p>Posts</p>
            <span>{user.posts || 0}</span>
          </div>
        </div>

        <div className="social-links">
          {user.githubUrl && <a href={user.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
          {user.instagramUrl && <a href={user.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {user.linkedinUrl && <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
