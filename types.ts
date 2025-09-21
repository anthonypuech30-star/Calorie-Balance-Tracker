
export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number; // in kg
  height: number; // in cm
}

export interface FoodLog {
  id: string;
  description: string;
  calories: number;
  timestamp: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  caloriesConsumed: number;
  caloriesBurned: number | null;
  foodEntries: FoodLog[];
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'LightlyActive',
  ModeratelyActive = 'ModeratelyActive',
  VeryActive = 'VeryActive',
  ExtraActive = 'ExtraActive',
}
