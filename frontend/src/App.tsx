import { useState } from 'react'
import { Button } from "@/components/ui/button"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LaunchScreen from './components/LaunchScreen'
import SignupPage from './components/SignupPage'
import SigninPage from './components/SigninPage'
import ProfilePage from './Pages/profile_page'
import UserSetup from './Pages/user-setup'
import './App.css'

function App() {
    const [count, setCount] = useState(0)
    const [showLaunch, setShowLaunch] = useState(true)
    const [currentPage, setCurrentPage] = useState<'signup' | 'signin' | 'profile' | 'setup'>('signup')


    // If launch screen is showing, show it - audrey
    if (showLaunch) {
        return <LaunchScreen onFinish={() => setShowLaunch(false)} duration={2000} />
    }

    // After launch screen, show the current page - audrey
    if (currentPage === 'signup') {
        return <SignupPage onNavigateToSignin={() => setCurrentPage('signin')} onSignupSuccess={() => setCurrentPage('profile')} />
    }

    // If user presses sign in link, show sign in page - audrey
    if (currentPage === 'signin') {
        return <SigninPage onNavigateToSignup={() => setCurrentPage('signup')} onSigninSuccess={() => setCurrentPage('profile')} />
    }

    if (currentPage === 'profile') {
        return (
            <div>
                <nav className="p-4 bg-gray-200 flex justify-between gap-4 absolute top-0 w-full z-50">
                    <Button variant="outline" onClick={() => {
                        localStorage.removeItem('token');
                        setCurrentPage('signin');
                    }}>Logout</Button>
                    <Button onClick={() => setCurrentPage('setup')}>Edit Profile (User Setup)</Button>
                </nav>
                <ProfilePage />
            </div>
        )
    }

    if (currentPage === 'setup') {
        return (
            <div>
                <nav className="p-4 bg-gray-200 flex justify-between gap-4 absolute top-0 w-full z-50">
                    <Button variant="outline" onClick={() => setCurrentPage('profile')}>Back to Profile</Button>
                </nav>
                <UserSetup />
            </div>
        )
    }

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <div className="flex pb-5 flex-col items-center justify-center">
                    <Button>Shadcn Button</Button>
                </div>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
