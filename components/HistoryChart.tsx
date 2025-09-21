
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyLog } from '../types';

interface HistoryChartProps {
  data: DailyLog[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const chartData = data.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    surplus_deficit: log.caloriesBurned ? log.caloriesConsumed - log.caloriesBurned : 0,
  })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-surface rounded-lg p-4 h-96 w-full shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-text-primary">Calorie Balance</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#BDBDBD" />
          <YAxis stroke="#BDBDBD" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}
            labelStyle={{ color: '#E0E0E0' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="surplus_deficit" 
            name="Surplus/Deficit"
            stroke="#03A9F4" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#03A9F4' }}
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
