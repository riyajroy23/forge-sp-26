import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import recoopLogo from '../assets/images/recoop-logo2.png';
import './SignupPage.css';

const SignupPage = () => {
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Signup:', { displayName, email, password });

        navigate("/setup");
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <img src={recoopLogo} alt="Recoop Logo" className="signup-logo" />

                <h1 className="signup-title">Create an account</h1>

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

                    <Button type="submit" className="signup-button">
                        Sign up
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