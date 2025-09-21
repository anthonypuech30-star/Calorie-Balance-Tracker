import React from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserProfile } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
  };
  
  const handleLogout = () => {
      setUserProfile(null);
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {userProfile ? (
        <Dashboard userProfile={userProfile} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;