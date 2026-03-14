import React, { useState, useMemo } from 'react';
import { UserProfile, DailyLog, FoodLog } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import CalorieLogForm from './CalorieLogForm';
import DailyChart from './DailyChart';
import HistoryChart from './HistoryChart';
import { PlateIcon, LogoutIcon, TrashIcon } from './icons';

interface DashboardProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onLogout }) => {
  const [logs, setLogs] = useLocalStorage<Record<string, DailyLog>>('calorieTrackerLogs', {});
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const todayStr = getTodayDateString();

  const todayLog = useMemo(() => {
    return logs[todayStr] || {
      date: todayStr,
      caloriesConsumed: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      foodEntries: [],
    };
  }, [logs, todayStr]);
  
  const handleLogMeal = (description: string, calories: number, protein: number, carbs: number, fat: number) => {
    const newLogEntry: FoodLog = {
      id: crypto.randomUUID(),
      description,
      calories,
      protein,
      carbs,
      fat,
      timestamp: Date.now(),
    };
    
    const updatedLog: DailyLog = {
      ...todayLog,
      caloriesConsumed: todayLog.caloriesConsumed + calories,
      totalProtein: todayLog.totalProtein + protein,
      totalCarbs: todayLog.totalCarbs + carbs,
      totalFat: todayLog.totalFat + fat,
      foodEntries: [newLogEntry, ...todayLog.foodEntries],
    };
    
    setLogs(prevLogs => ({ ...prevLogs, [todayStr]: updatedLog }));
  };

  const handleDeleteMeal = (mealId: string) => {
    const mealToDelete = todayLog.foodEntries.find(entry => entry.id === mealId);
    if (!mealToDelete) return;

    const updatedFoodEntries = todayLog.foodEntries.filter(entry => entry.id !== mealId);
    
    const updatedLog: DailyLog = {
      ...todayLog,
      caloriesConsumed: todayLog.caloriesConsumed - mealToDelete.calories,
      totalProtein: todayLog.totalProtein - mealToDelete.protein,
      totalCarbs: todayLog.totalCarbs - mealToDelete.carbs,
      totalFat: todayLog.totalFat - mealToDelete.fat,
      foodEntries: updatedFoodEntries,
    };

    setLogs(prevLogs => ({ ...prevLogs, [todayStr]: updatedLog }));
  };


  const getChartData = () => {
    const allLogs = Object.values(logs).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (view === 'weekly') return allLogs.slice(-7);
    if (view === 'monthly') return allLogs.slice(-30);
    return [];
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Food Tracker</h1>
          <p className="text-text-secondary">Track your calories and macros instantly.</p>
        </div>
      </header>

      {/* Mobile Log Form - Top of page on mobile */}
      <div className="lg:hidden">
        <CalorieLogForm onLog={handleLogMeal} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg p-6 flex items-center space-x-4 shadow-lg border-l-4 border-accent">
          <div className="p-3 bg-accent/20 rounded-full">
            <PlateIcon className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wider">Calories</p>
            <p className="text-2xl font-bold">{todayLog.caloriesConsumed.toLocaleString()} <span className="text-sm font-normal text-text-secondary">kcal</span></p>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 flex items-center space-x-4 shadow-lg border-l-4 border-primary">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wider">Protein</p>
            <p className="text-2xl font-bold">{Math.round(todayLog.totalProtein)} <span className="text-sm font-normal text-text-secondary">g</span></p>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 flex items-center space-x-4 shadow-lg border-l-4 border-secondary">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wider">Carbs</p>
            <p className="text-2xl font-bold">{Math.round(todayLog.totalCarbs)} <span className="text-sm font-normal text-text-secondary">g</span></p>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 flex items-center space-x-4 shadow-lg border-l-4 border-danger">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wider">Fat</p>
            <p className="text-2xl font-bold">{Math.round(todayLog.totalFat)} <span className="text-sm font-normal text-text-secondary">g</span></p>
          </div>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Desktop Log Form - Only visible on large screens */}
          <div className="hidden lg:block">
            <CalorieLogForm onLog={handleLogMeal} />
          </div>
          <div className="bg-surface p-6 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Today's Food Log</h3>
            {todayLog.foodEntries.length === 0 ? (
              <p className="text-text-secondary">No meals logged yet today.</p>
            ) : (
              <ul className="space-y-4">
                {todayLog.foodEntries.map(entry => (
                  <li key={entry.id} className="flex flex-col bg-background p-3 rounded-md border border-border/50">
                    <div className="flex justify-between items-center mb-1">
                        <span className="flex-1 pr-4 truncate font-medium" title={entry.description}>{entry.description}</span>
                        <button 
                            onClick={() => handleDeleteMeal(entry.id)} 
                            className="text-text-secondary hover:text-danger transition-colors"
                            aria-label={`Delete entry for ${entry.description}`}
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-3 text-[10px] text-text-secondary uppercase">
                            <span>P: {Math.round(entry.protein)}g</span>
                            <span>C: {Math.round(entry.carbs)}g</span>
                            <span>F: {Math.round(entry.fat)}g</span>
                        </div>
                        <span className="font-semibold text-accent text-sm">{entry.calories.toLocaleString()} kcal</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
           <div className="bg-surface rounded-lg p-4 shadow-lg">
                <div className="flex justify-center border-b border-border mb-4">
                    <button onClick={() => setView('daily')} className={`px-4 py-2 font-semibold ${view === 'daily' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Daily Macros</button>
                    <button onClick={() => setView('weekly')} className={`px-4 py-2 font-semibold ${view === 'weekly' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Weekly History</button>
                    <button onClick={() => setView('monthly')} className={`px-4 py-2 font-semibold ${view === 'monthly' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Monthly History</button>
                </div>
                {view === 'daily' ? <DailyChart log={todayLog} /> : <HistoryChart data={getChartData()} />}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;