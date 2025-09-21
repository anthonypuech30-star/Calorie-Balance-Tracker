import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, DailyLog, FoodLog } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import CalorieLogForm from './CalorieLogForm';
import ActivityModal from './ActivityModal';
import DailyChart from './DailyChart';
import HistoryChart from './HistoryChart';
import { FlameIcon, PlateIcon, LogoutIcon } from './icons';

interface DashboardProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onLogout }) => {
  const [logs, setLogs] = useLocalStorage<Record<string, DailyLog>>('calorieTrackerLogs', {});
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const todayStr = getTodayDateString();

  const todayLog = useMemo(() => {
    return logs[todayStr] || {
      date: todayStr,
      caloriesConsumed: 0,
      caloriesBurned: null,
      foodEntries: [],
    };
  }, [logs, todayStr]);
  
  const historyLogs = useMemo(() => {
      return Object.values(logs).filter(log => log.date !== todayStr);
  }, [logs, todayStr]);

  useEffect(() => {
    // Prompt for activity if not set for the day
    if (todayLog.caloriesBurned === null) {
      setIsActivityModalOpen(true);
    }
  }, [todayLog.caloriesBurned]);
  
  const handleLogMeal = (description: string, calories: number) => {
    const newLogEntry: FoodLog = {
      id: crypto.randomUUID(),
      description,
      calories,
      timestamp: Date.now(),
    };
    
    const updatedLog: DailyLog = {
      ...todayLog,
      caloriesConsumed: todayLog.caloriesConsumed + calories,
      foodEntries: [newLogEntry, ...todayLog.foodEntries],
    };
    
    setLogs(prevLogs => ({ ...prevLogs, [todayStr]: updatedLog }));
  };

  const handleSaveActivity = (caloriesBurned: number) => {
    const updatedLog: DailyLog = {
      ...todayLog,
      caloriesBurned,
    };
    setLogs(prevLogs => ({ ...prevLogs, [todayStr]: updatedLog }));
  };

  const getChartData = () => {
    const allLogs = Object.values(logs).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (view === 'weekly') return allLogs.slice(0, 7);
    if (view === 'monthly') return allLogs.slice(0, 30);
    return [];
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Welcome, {userProfile.name}!</h1>
          <p className="text-text-secondary">Here's your calorie balance summary.</p>
        </div>
        <button onClick={onLogout} className="flex items-center space-x-2 text-sm bg-surface px-3 py-2 rounded-lg hover:bg-border transition">
          <LogoutIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg p-6 flex items-center space-x-4 shadow-lg">
          <div className="p-3 bg-accent/20 rounded-full">
            <PlateIcon className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="text-text-secondary">Consumed Today</p>
            <p className="text-2xl font-bold">{todayLog.caloriesConsumed.toLocaleString()} kcal</p>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 flex items-center space-x-4 shadow-lg">
          <div className="p-3 bg-primary/20 rounded-full">
            <FlameIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-text-secondary">Burned Today</p>
            {todayLog.caloriesBurned !== null ? (
              <p className="text-2xl font-bold">{todayLog.caloriesBurned.toLocaleString()} kcal</p>
            ) : (
              <p className="text-sm text-text-secondary">Set activity level</p>
            )}
          </div>
        </div>
         <button onClick={() => setIsActivityModalOpen(true)} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:opacity-90 transition h-full text-lg">
            Update Activity Level
          </button>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <CalorieLogForm onLog={handleLogMeal} />
          <div className="bg-surface p-6 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Today's Food Log</h3>
            {todayLog.foodEntries.length === 0 ? (
              <p className="text-text-secondary">No meals logged yet today.</p>
            ) : (
              <ul className="space-y-4">
                {todayLog.foodEntries.map(entry => (
                  <li key={entry.id} className="flex justify-between items-center bg-background p-3 rounded-md">
                    <span className="flex-1 pr-4 truncate">{entry.description}</span>
                    <span className="font-semibold text-accent">{entry.calories.toLocaleString()} kcal</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
           <div className="bg-surface rounded-lg p-4 shadow-lg">
                <div className="flex justify-center border-b border-border mb-4">
                    <button onClick={() => setView('daily')} className={`px-4 py-2 font-semibold ${view === 'daily' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Daily</button>
                    <button onClick={() => setView('weekly')} className={`px-4 py-2 font-semibold ${view === 'weekly' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Weekly</button>
                    <button onClick={() => setView('monthly')} className={`px-4 py-2 font-semibold ${view === 'monthly' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Monthly</button>
                </div>
                {view === 'daily' ? <DailyChart log={todayLog} /> : <HistoryChart data={getChartData()} />}
           </div>
        </div>
      </main>

      {isActivityModalOpen && (
        <ActivityModal
          userProfile={userProfile}
          onClose={() => setIsActivityModalOpen(false)}
          onSave={handleSaveActivity}
        />
      )}
    </div>
  );
};

export default Dashboard;