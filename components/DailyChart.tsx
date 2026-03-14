
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DailyLog } from '../types';

interface DailyChartProps {
  log: DailyLog;
}

const DailyChart: React.FC<DailyChartProps> = ({ log }) => {
  const data = [
    { name: 'Protein', value: Math.round(log.totalProtein), color: '#4CAF50' },
    { name: 'Carbs', value: Math.round(log.totalCarbs), color: '#03A9F4' },
    { name: 'Fat', value: Math.round(log.totalFat), color: '#F44336' },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-surface rounded-lg p-4 h-96 w-full shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-text-primary">Macronutrient Breakdown (g)</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #444', borderRadius: '8px' }}
              itemStyle={{ color: '#E0E0E0' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-text-secondary italic">
          Log a meal to see your macro breakdown
        </div>
      )}
    </div>
  );
};

export default DailyChart;
