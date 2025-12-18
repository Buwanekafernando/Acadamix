import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';
import logo from '../assets/logo.png';
import { motion } from 'motion/react';
import { fadeIn, slideUp } from '../utils/animations';

const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect';
    };

    return (
        <div className="login-wrapper">
            <motion.div
                className="login-container glass-panel"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                <div className="login-left">
                    <motion.div className="login-form" variants={slideUp}>
                        <div className="login-logo">
                            <img src={logo} alt="Academix Logo" />
                        </div>
                        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Welcome Back</h2>
                        <motion.button
                            className="google-login-btn"
                            onClick={handleGoogleLogin}
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <img
                                src="https://www.google.com/favicon.ico"
                                alt="Google"
                                className="google-icon"
                            />
                            Sign in with Google
                        </motion.button>
                    </motion.div>
                </div>
                <div className="login-right">
                    <motion.img
                        src="https://img.freepik.com/free-vector/online-learning-isometric-concept_1284-17947.jpg"
                        alt="Learning"
                        className="login-img"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
