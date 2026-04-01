import React from 'react';
import { AuthForm } from './AuthForm';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleAuthSuccess = (email: string) => {
        login(email);
        navigate('/');
    };

    return (
        <div className="login-page">
            <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
    );
};
