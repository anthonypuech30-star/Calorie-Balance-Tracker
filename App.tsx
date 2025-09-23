import React from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserProfile } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';

function App() {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleOnboardingComplete = (completeProfile: UserProfile) => {
    setUserProfile(completeProfile);
  };
  
  const handleLogout = () => {
      setUserProfile(null);
  }

  const renderContent = () => {
    if (!userProfile) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    // If the user profile is the default one, show the onboarding screen.
    if (userProfile.name === 'Alex Doe') { 
      return <Onboarding onOnboardingComplete={handleOnboardingComplete} />;
    }
    // Otherwise, show the main dashboard.
    return <Dashboard userProfile={userProfile} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {renderContent()}
    </div>
  );
}

export default App;
