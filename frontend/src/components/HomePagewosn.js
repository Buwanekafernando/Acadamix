import React from 'react';
import '../styles/Homepagewosn.css';
import homeImage from '../assets/academic.jpg';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, Users, Brain, Star, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeIn, slideUp, staggerContainer, hoverScale } from '../utils/animations';

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.img
          src={homeImage}
          alt="Academix illustration"
          className="hero-image"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        />
        <div className="hero-overlay">
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 className="title gradient-text" variants={slideUp}>
              Academix
            </motion.h1>
            <motion.p className="tagline" variants={slideUp}>
              Empowering Smarter Learning & Productive Students
            </motion.p>
            <motion.button
              className="login-button btn-primary"
              onClick={handleLoginClick}
              variants={slideUp}
              whileHover={hoverScale}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-section">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          What Our Users Say
        </motion.h2>
        <motion.div
          className="feedback-cards"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { text: "Academix completely changed the way I study!", author: "Sinali, University Student" },
            { text: "The to-do list & timer kept me on track during finals.", author: "Gagana, University Student" },
            { text: "I love the notifications and clean design!", author: "Ayesha, University Student" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="feedback-card glass-panel"
              variants={slideUp}
              whileHover={{ y: -10 }}
            >
              <Star className="icon" color="gold" fill="gold" />
              <p>"{item.text}"</p>
              <span>- {item.author}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          What Can You Do on Academix?
        </motion.h2>
        <motion.div
          className="features"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: Book, title: "Organize Your Learning", desc: "Manage your study materials and tasks efficiently." },
            { icon: Clock, title: "Study Timer", desc: "Track your focus with a built-in Pomodoro timer." },
            { icon: Users, title: "Community Sharing", desc: "Connect, share posts and like others' ideas." },
            { icon: Brain, title: "Smart Assistant", desc: "Use our integrated chatbot for instant learning help." }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card glass-panel"
              variants={slideUp}
              whileHover={hoverScale}
            >
              <feature.icon className="icon" size={40} color="var(--primary-color)" />
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
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
