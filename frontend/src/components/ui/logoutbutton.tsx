import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { clearAuth } from '@/lib/auth';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // clear token and user from localStorage
        clearAuth();
        // redirect to signin
        navigate('/signin');
    };

    return (
        <Button onClick={handleLogout}>
            Log out
        </Button>
    );
};

export default LogoutButton;