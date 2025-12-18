import React from 'react';
import '../styles/Homepagewosn.css';
import homeImage from '../assets/academic.jpg';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, Users, Brain, Star, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <img src={homeImage} alt="Academix illustration" className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-text">
            <h1 className="title">Academix</h1>
            <p className="tagline">Empowering Smarter Learning & Productive Students</p>
            <button className="login-button" onClick={handleLoginClick}>Login</button>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-section">
        <h2>What Our Users Say</h2>
        <div className="feedback-cards">
          <div className="feedback-card">
            <Star className="icon" />
            <p>"Academix completely changed the way I study!"</p>
            <span>- Sinali, University Student</span>
          </div>
          <div className="feedback-card">
            <Star className="icon" />
            <p>"The to-do list & timer kept me on track during finals."</p>
            <span>- Gagana, University Student</span>
          </div>
          <div className="feedback-card">
            <Star className="icon" />
            <p>"I love the notifications and clean design!"</p>
            <span>- Ayesha, University Student</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>What Can You Do on Academix?</h2>
        <div className="features">
          <div className="feature-card">
            <Book className="icon" />
            <h3>Organize Your Learning</h3>
            <p>Manage your study materials and tasks efficiently.</p>
          </div>
          <div className="feature-card">
            <Clock className="icon" />
            <h3>Study Timer</h3>
            <p>Track your focus with a built-in Pomodoro timer.</p>
          </div>
          <div className="feature-card">
            <Users className="icon" />
            <h3>Community Sharing</h3>
            <p>Connect, share posts and like others' ideas.</p>
          </div>
          <div className="feature-card">
            <Brain className="icon" />
            <h3>Smart Assistant</h3>
            <p>Use our integrated chatbot for instant learning help.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h2 className="footer-title">Academix</h2>
          <p className="footer-tagline">Empowering Smarter Learning</p>
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Features</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-socials">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Mail size={20} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Academix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
