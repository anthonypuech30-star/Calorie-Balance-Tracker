import React from 'react';
import { UserProfile } from '../types';
import { GoogleIcon } from './icons';

interface LoginProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const handleGoogleSignIn = () => {
    // Simulate a successful Google Sign-In and create a mock profile
    const mockProfile: UserProfile = {
      name: 'Alex Doe',
      age: 30,
      gender: 'male',
      weight: 75,
      height: 180,
    };
    onLoginSuccess(mockProfile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-gray-900 p-4">
      <div className="w-full max-w-sm bg-surface rounded-xl shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Calorie Balance Tracker</h1>
        <p className="text-text-secondary mb-8">Sign in to track your health journey</p>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex justify-center items-center py-3 px-4 border border-border rounded-md shadow-sm bg-background text-lg font-medium text-text-primary hover:bg-border transition"
        >
          <GoogleIcon className="w-6 h-6 mr-3" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;