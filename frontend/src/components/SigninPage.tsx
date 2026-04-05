import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import recoopLogo from '../assets/images/recoop-logo2.png';
import { saveAuth } from '@/lib/auth';
import './SigninPage.css';

const API_URL = 'http://localhost:3000/api';

const SigninPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // display error message returned from backend (e.g. invalid credentials)
                setError(data.error || 'Sign in failed. Please try again.');
                return;
            }

            // store token and user in localStorage
            saveAuth(data.data.token, data.data.user);

            // navigate to setup page
            navigate('/setup');

        } catch (err) {
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                <img src={recoopLogo} alt="Recoop Logo" className="signin-logo" />

                <h1 className="signin-title">Sign In</h1>

                {/* display error message from backend if login fails */}
                {error && (
                    <p style={{ color: '#a83232', textAlign: 'center', marginBottom: '1rem', fontFamily: 'Fredoka, sans-serif' }}>
                        {error}
                    </p>
                )}

                <form onSubmit={handleSignin} className="signin-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="signin-button" disabled={loading}>
                        {loading ? 'Signing in...' : 'Log in'}
                    </Button>
                </form>

                <p className="signup-link">
                    Don't have an account?{" "}
                    <a onClick={() => navigate("/signup")} style={{ cursor: 'pointer' }}>
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SigninPage;