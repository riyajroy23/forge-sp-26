import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import recoopLogo from '../assets/images/recoop-logo2.png';
import './SigninPage.css';

const SigninPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Sign in:', { email, password });

        navigate("/setup");
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                <img src={recoopLogo} alt="Recoop Logo" className="signin-logo" />

                <h1 className="signin-title">Sign In</h1>

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