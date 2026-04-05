import { useState } from 'react';
import { Button } from "@/components/ui/button";
import recoopLogo from '../assets/images/recoop-logo2.png';
import './SigninPage.css';
import { api } from '../lib/api';

interface SigninPageProps {
    onNavigateToSignup: () => void;
    onSigninSuccess: () => void;
}

const SigninPage = ({ onNavigateToSignup, onSigninSuccess }: SigninPageProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.login({ email, password });
            if (res.success) {
                localStorage.setItem('token', res.data.token);
                onSigninSuccess();
            } else {
                setError(res.error || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                <img src={recoopLogo} alt="Recoop Logo" className="signin-logo" />

                <h1 className="signin-title">Sign In</h1>
                
                {error && <p className="text-red-500 mb-4">{error}</p>}

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

                    <Button type="submit" className="signin-button">
                        Log in
                    </Button>
                </form>
                <p className="signup-link">
                    Don't have an account? <a onClick={onNavigateToSignup} style={{ cursor: 'pointer' }}>Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SigninPage;