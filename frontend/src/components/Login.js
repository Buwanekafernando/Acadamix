import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';
import logo from '../assets/logo.png';

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
            <div className="login-left">
                <div className="login-form">
                    <div className="login-logo">
                        <img src={logo} alt="Academix Logo" />
                    </div>
                    <button
                        className="google-login-btn"
                        onClick={handleGoogleLogin}
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="google-icon"
                        />
                        Sign in with Google
                    </button>
                </div>
            </div>
            <div className="login-right">
                <img
                    src="https://img.freepik.com/free-vector/online-learning-isometric-concept_1284-17947.jpg"
                    alt="Learning"
                    className="login-img"
                />
            </div>
        </div>
    );
};

export default Login;
