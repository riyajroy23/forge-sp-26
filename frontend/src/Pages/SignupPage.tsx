import { useState } from 'react';
import { Button } from "@/components/ui/button";
import recoopLogo from '../assets/images/recoop-logo2.png';
import './SignupPage.css';
import { api } from '../lib/api';

interface SignupPageProps {
    onNavigateToSignin: () => void;
    onSignupSuccess: () => void;
}

const SignupPage = ({ onNavigateToSignin, onSignupSuccess }: SignupPageProps) => {
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.signup({
                email,
                username,
                password,
                role,
                name: displayName
            });

            if (res.success) {
                localStorage.setItem('token', res.data.token);
                onSignupSuccess();
            } else {
                setError(res.error || 'Signup failed');
            }
        } catch (err) {
            setError((err as Error).message || 'An error occurred during signup');
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <img src={recoopLogo} alt="Recoop Logo" className="signup-logo" />

                <h1 className="signup-title">Create an account</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSignup} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="bg-white border text-black p-2 rounded"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="EMPLOYEE">Employee</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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

                    <Button type="submit" className="signup-button">
                        Sign up
                    </Button>
                </form>
                <p className="signin-link">
                    Already have an account? <a onClick={onNavigateToSignin} style={{ cursor: 'pointer' }}>Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;