import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onOnboardingComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onOnboardingComplete }) => {
  const [profile, setProfile] = useState<Omit<UserProfile, 'name'> & { name: string }>({
    name: '',
    age: 0,
    gender: 'male',
    weight: 0,
    height: 0,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, age, weight, height } = profile;
    if (name.trim().length > 1 && age > 0 && weight > 0 && height > 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onOnboardingComplete(profile as UserProfile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-gray-900 p-4">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-2xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome!</h1>
          <p className="text-text-secondary mb-8">Let's set up your profile for personalized tracking.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
            <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className="w-full p-3 bg-background rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none transition" placeholder="e.g., Alex Doe" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-text-secondary mb-1">Age</label>
              <input type="number" name="age" id="age" value={profile.age || ''} onChange={handleChange} className="w-full p-3 bg-background rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none transition" placeholder="e.g., 30" required />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-text-secondary mb-1">Gender</label>
              <select name="gender" id="gender" value={profile.gender} onChange={handleChange} className="w-full p-3 bg-background rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none transition">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-text-secondary mb-1">Weight (kg)</label>
              <input type="number" name="weight" id="weight" value={profile.weight || ''} onChange={handleChange} className="w-full p-3 bg-background rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none transition" placeholder="e.g., 75" required />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-text-secondary mb-1">Height (cm)</label>
              <input type="number" name="height" id="height" value={profile.height || ''} onChange={handleChange} className="w-full p-3 bg-background rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none transition" placeholder="e.g., 180" required />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Save Profile & Start Tracking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
