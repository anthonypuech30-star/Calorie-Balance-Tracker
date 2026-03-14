
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyLog } from '../types';

interface HistoryChartProps {
  data: DailyLog[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const chartData = data.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    consumed: log.caloriesConsumed,
  }));

  return (
    <div className="bg-surface rounded-lg p-4 h-96 w-full shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-text-primary">Calorie Intake History</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#BDBDBD" />
          <YAxis stroke="#BDBDBD" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #444', borderRadius: '8px' }}
            labelStyle={{ color: '#E0E0E0' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="consumed" 
            name="Calories (kcal)"
            stroke="#FFC107" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#FFC107' }}
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
