import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';

const OAuth2Redirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
            console.error('OAuth error:', error);
            navigate('/login', { state: { error: 'Authentication failed' } });
            return;
        }

        if (token) {
            login(token);
            // Only navigate if not already authenticated
            if (!isAuthenticated) {
                navigate('/home');
            }
        } else {
            navigate('/login', { state: { error: 'No token received' } });
        }
    }, [location, navigate, login, isAuthenticated]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <Loader className="animate-spin" size={48} />
            <p>Processing login...</p>
        </div>
    );
};

export default OAuth2Redirect; 