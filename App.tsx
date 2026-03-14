import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  // We'll use a static profile to skip all onboarding/login steps
  const userProfile = {
    name: 'User',
    age: 30,
    gender: 'male' as const,
    weight: 70,
    height: 170
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Dashboard userProfile={userProfile} onLogout={() => {}} />
    </div>
  );
}

export default App;
