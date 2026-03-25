import { useEffect, useState } from 'react';
import './LaunchScreen.css';
import recoopLogo from '../assets/images/recoop-logo.png';

interface LaunchScreenProps {
    onFinish: () => void;
    duration?: number;
}

const LaunchScreen = ({ onFinish, duration = 2000 }: LaunchScreenProps) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                onFinish();
            }, 500);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onFinish]);

    return (
        <div className={`launch-screen ${fadeOut ? 'fade-out' : ''}`}>
            <div className="launch-screen-content">
                <img
                    src={recoopLogo}
                    alt="Recoop Logo"
                    className="launch-logo"
                />
            </div>
        </div>
    );
};

export default LaunchScreen;