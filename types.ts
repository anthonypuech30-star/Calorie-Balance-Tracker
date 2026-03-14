
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
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  caloriesConsumed: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  foodEntries: FoodLog[];
}
