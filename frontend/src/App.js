import React from 'react';
import './styles/Homepagewosn.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './components/HomePagewosn';
import LoginPage from './components/Login';
import Home from './components/Home';
import FileSharing from './components/FileSharing';
import ChatBox from './components/ChatBox';
import Profile from './components/UserProfile';
import ProfileView from './components/UserProfileView';
import OAuthCallback from './components/OAuthCallback';
import OAuth2Redirect from './components/OAuth2Redirect';
import Todo from './components/Todo';
import Notifications from './components/Notifications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/filesharing" element={<FileSharing />} />
          <Route path="/chatbox" element={<ChatBox />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/uprofileview" element={<ProfileView />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
