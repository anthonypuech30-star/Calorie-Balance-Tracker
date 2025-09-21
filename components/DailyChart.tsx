
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyLog } from '../types';

interface DailyChartProps {
  log: DailyLog;
}

const DailyChart: React.FC<DailyChartProps> = ({ log }) => {
  const data = [
    { name: 'Today', consumed: log.caloriesConsumed, burned: log.caloriesBurned ?? 0 },
  ];
  
  const balance = (log.caloriesBurned ?? 0) > 0 ? log.caloriesConsumed - (log.caloriesBurned ?? 0) : null;

  return (
    <div className="bg-surface rounded-lg p-4 h-96 w-full shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-text-primary">Today's Summary</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis type="number" stroke="#BDBDBD" />
          <YAxis type="category" dataKey="name" stroke="#BDBDBD" hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}
            labelStyle={{ color: '#E0E0E0' }}
          />
          <Legend />
          <Bar dataKey="consumed" name="Calories Consumed" fill="#FFC107" />
          <Bar dataKey="burned" name="Calories Burned" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        {balance !== null && (
          <p className={`text-xl font-bold ${balance > 0 ? 'text-surplus' : 'text-deficit'}`}>
            {balance > 0 ? `Surplus: ${balance.toLocaleString()}` : `Deficit: ${Math.abs(balance).toLocaleString()}`} kcal
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyChart;
