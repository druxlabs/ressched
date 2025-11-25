import React from 'react';
import { Stats } from '../types';
import { Users, BarChart2 } from 'lucide-react';

interface StatsOverviewProps {
  stats: Stats;
  date: Date;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, date }) => {
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Daily Snapshot</h2>
          <p className="text-slate-500 text-sm">{formattedDate}</p>
        </div>
        
        <div className="flex space-x-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
              <Users size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalOnService}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Active Residents</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mr-3">
              <BarChart2 size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{Object.keys(stats.rotationCounts).length}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Active Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mini distribution bar */}
      <div className="mt-6">
         <div className="flex h-2 rounded-full overflow-hidden w-full bg-slate-100">
            {Object.entries(stats.rotationCounts).map(([rotation, count], idx) => {
              // Simple hash for color consistency without complex logic
              const colors = ['bg-blue-500', 'bg-teal-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-red-500', 'bg-cyan-500'];
              const color = colors[idx % colors.length];
              const width = `${(Number(count) / stats.totalOnService) * 100}%`;
              return <div key={rotation} className={color} style={{ width }} title={`${rotation}: ${count}`} />;
            })}
         </div>
         <div className="mt-2 flex flex-wrap gap-3">
            {Object.entries(stats.rotationCounts).map(([rotation, count], idx) => (
               <div key={rotation} className="flex items-center text-xs text-slate-600">
                 <div className={`w-2 h-2 rounded-full mr-1.5 ${['bg-blue-500', 'bg-teal-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-red-500', 'bg-cyan-500'][idx % 8]}`}></div>
                 {rotation} <span className="ml-1 font-semibold text-slate-800">({count})</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};