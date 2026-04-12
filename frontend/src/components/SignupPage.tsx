import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import recoopLogo from '../assets/images/recoop-logo2.png';
import { saveAuth } from '@/lib/auth';
import './SignupPage.css';

const API_URL = 'http://localhost:3000/api';

const SignupPage = () => {
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: displayName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // display error message returned from backend (e.g. invalid email, weak password)
                setError(data.error || 'Signup failed. Please try again.');
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
        <div className="signup-page">
            <div className="signup-container">
                <img src={recoopLogo} alt="Recoop Logo" className="signup-logo" />

                <h1 className="signup-title">Create an account</h1>

                {/* display error message from backend if signup fails */}
                {error && (
                    <p style={{ color: '#a83232', textAlign: 'center', marginBottom: '1rem', fontFamily: 'Fredoka, sans-serif' }}>
                        {error}
                    </p>
                )}

                <form onSubmit={handleSignup} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="displayName">Display Name</label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>

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

                    <Button type="submit" className="signup-button" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign up'}
                    </Button>
                </form>

                <p className="signin-link">
                    Already have an account?{" "}
                    <a onClick={() => navigate("/signin")} style={{ cursor: 'pointer' }}>
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;