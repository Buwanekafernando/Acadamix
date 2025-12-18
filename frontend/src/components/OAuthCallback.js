import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const username = params.get('user');
        const email = params.get('email');
        const name = params.get('name');

        if (token && username) {
            // Store the token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                username,
                email,
                name
            }));
            
            // Redirect to home page
            navigate('/home');
        } else {
            // If no token, redirect to login with error
            navigate('/login?error=oauth_failed&message=Authentication failed');
        }
    }, [location, navigate]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{ 
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h2>Completing sign in...</h2>
                <p>Please wait while we complete your authentication.</p>
            </div>
        </div>
    );
}

export default OAuthCallback; 