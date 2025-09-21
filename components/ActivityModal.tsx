import React, { useState } from 'react';
import { ActivityLevel, UserProfile } from '../types';
import { ACTIVITY_LEVEL_MULTIPLIERS } from '../constants';

interface ActivityModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onSave: (caloriesBurned: number) => void;
}

const calculateBMR = (profile: UserProfile): number => {
    const { weight, height, age, gender } = profile;
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};

const ActivityModal: React.FC<ActivityModalProps> = ({ userProfile, onClose, onSave }) => {
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(ActivityLevel.Sedentary);

  const handleSave = () => {
    const bmr = calculateBMR(userProfile);
    const multiplier = ACTIVITY_LEVEL_MULTIPLIERS[activityLevel];
    const tdee = Math.round(bmr * multiplier);
    onSave(tdee);
    onClose();
  };
  
  const activityInfo: Record<ActivityLevel, { description: string; example: string; }> = {
      [ActivityLevel.Sedentary]: {
          description: "Little to no exercise.",
          example: "You spend most of the day sitting (e.g., desk job, driving)."
      },
      [ActivityLevel.LightlyActive]: {
          description: "Light exercise or sports 1-3 days/week.",
          example: "e.g., walking for 30-60 mins, light jogging, yoga."
      },
      [ActivityLevel.ModeratelyActive]: {
          description: "Moderate exercise or sports 3-5 days/week.",
          example: "e.g., running, cycling, swimming for an hour."
      },
      [ActivityLevel.VeryActive]: {
          description: "Hard exercise or sports 6-7 days a week.",
          example: "e.g., intense weightlifting, HIIT, team sports practice."
      },
      [ActivityLevel.ExtraActive]: {
          description: "Very hard exercise/sports & a physical job.",
          example: "e.g., construction worker, professional athlete, marathon training."
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">What was your activity level today?</h2>
        <div className="space-y-4">
          {Object.values(ActivityLevel).map((level) => (
            <div key={level}>
              <label className="flex items-start p-4 rounded-lg bg-background hover:bg-border transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="activityLevel"
                  value={level}
                  checked={activityLevel === level}
                  onChange={() => setActivityLevel(level)}
                  className="form-radio h-5 w-5 text-primary bg-gray-700 border-gray-600 focus:ring-primary mt-1 flex-shrink-0"
                />
                <div className="ml-4">
                    <span className="text-md font-semibold text-text-primary">{level.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <p className="text-sm text-text-secondary mt-1">{activityInfo[level].description}</p>
                    <p className="text-sm text-text-secondary/80 italic mt-1">{activityInfo[level].example}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-focus text-white font-semibold transition-colors"
          >
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;