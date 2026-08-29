import { useState, useRef } from 'react';
import { ChevronRight, Upload } from 'lucide-react';
import recoopLogo from '../assets/images/recoop-logo-white-alt.png';
import './AccountSettings.css';

// Placeholder avatar SVGs for the UI mockup
const HumanAvatar = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="50" fill="#fbc2a1" />
        <path d="M50 100 C20 100 20 60 50 60 C80 60 80 100 50 100 Z" fill="#2d1b2e" />
        <circle cx="50" cy="45" r="18" fill="#f4a460" />
        <path d="M35 40 Q50 20 65 40 Q50 30 35 40 Z" fill="#d2691e" />
    </svg>
);

const DogAvatar = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="50" fill="#f09ba0" />
        <circle cx="50" cy="55" r="22" fill="#fff" />
        <circle cx="42" cy="50" r="4" fill="#000" />
        <circle cx="58" cy="50" r="4" fill="#000" />
        <ellipse cx="50" cy="62" rx="6" ry="4" fill="#000" />
        <path d="M30 40 Q40 20 50 35 Q60 20 70 40 L65 50 L35 50 Z" fill="#8b4513" />
    </svg>
);

const AccountSettings = () => {
    const [selectedAvatar, setSelectedAvatar] = useState<'human' | 'dog' | 'custom'>('human');
    const [customAvatar, setCustomAvatar] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCustomAvatar(url);
            setSelectedAvatar('custom');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="account-settings-page">
            <nav className="account-settings-navbar">
                <img src={recoopLogo} alt="Recoop Logo" className="account-settings-logo" />
                <div className="account-settings-user-nav">
                    <span className="user-greeting">Hi, Becky!</span>
                    <div className="user-avatar-small">
                        <HumanAvatar />
                    </div>
                </div>
            </nav>

            <main className="account-settings-content">
                <h1 className="account-settings-title">Account Settings</h1>

                <section className="settings-section">
                    <h2 className="settings-section-title">Manage Profile</h2>

                    <div className="settings-row">
                        <div className="settings-label">Profile Picture</div>
                        <div className="avatar-selection">
                            <div
                                className={`avatar-option ${selectedAvatar === 'human' ? 'selected' : ''}`}
                                onClick={() => setSelectedAvatar('human')}
                            >
                                <HumanAvatar />
                            </div>
                            <div
                                className={`avatar-option ${selectedAvatar === 'dog' ? 'selected' : ''}`}
                                onClick={() => setSelectedAvatar('dog')}
                            >
                                <DogAvatar />
                            </div>
                            {customAvatar && (
                                <div
                                    className={`avatar-option ${selectedAvatar === 'custom' ? 'selected' : ''}`}
                                    onClick={() => setSelectedAvatar('custom')}
                                >
                                    <img src={customAvatar} alt="Custom avatar" />
                                </div>
                            )}
                            <button className="upload-avatar-button" onClick={triggerFileInput}>
                                <Upload size={18} />
                                <span>Upload</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="settings-label">Display Name</div>
                        <div className="display-name-value">
                            Becky Smith
                            <ChevronRight size={20} className="chevron-icon" />
                        </div>
                    </div>
                </section>

                <div className="settings-divider"></div>

                <section className="settings-section">
                    <h2 className="settings-section-title">Account Information</h2>

                    <div className="settings-row">
                        <div className="settings-label">Email</div>
                        <div className="settings-input-container">
                            <input
                                type="email"
                                className="settings-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="settings-label">Username</div>
                        <div className="settings-input-container">
                            <input
                                type="text"
                                className="settings-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="settings-label">Password</div>
                        <div className="settings-input-container">
                            <input
                                type="password"
                                className="settings-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AccountSettings;
