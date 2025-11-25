import React from 'react';
import { isSameDay } from '../utils/dateUtils';

interface DayOverviewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DayOverview: React.FC<DayOverviewProps> = ({ selectedDate, onDateChange }) => {
  // Calculate start of the week (Sunday) based on selected date
  // This ensures the view always shows the week containing the selected date
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

  // Generate the 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="bg-white border-b border-slate-200 pt-6 pb-6 px-4 sm:px-6 lg:px-8 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
                <h2 className="text-sm font-bold text-usf-green uppercase tracking-wide mb-1">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
                </h1>
            </div>
            <div className="hidden md:block text-slate-400 text-sm font-medium mb-1">
                Week of {startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {weekDays.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());
                
                return (
                    <button
                        key={date.toISOString()}
                        onClick={() => onDateChange(date)}
                        className={`
                            group flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 border relative overflow-hidden
                            ${isSelected 
                                ? 'bg-usf-green border-usf-green shadow-md ring-2 ring-usf-green ring-offset-1' 
                                : 'bg-white border-slate-200 hover:border-usf-green/50 hover:shadow-sm'
                            }
                        `}
                    >
                        <span className={`text-[10px] sm:text-xs font-bold mb-0.5 uppercase tracking-wider ${isSelected ? 'text-green-100' : 'text-slate-400 group-hover:text-usf-green'}`}>
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <div className="relative z-10">
                            <span className={`text-lg sm:text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                {date.getDate()}
                            </span>
                        </div>
                        
                        {/* Today indicator dot */}
                        {isToday && !isSelected && (
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-usf-gold"></div>
                        )}
                        
                        {/* Background decoration for selected */}
                        {isSelected && (
                           <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/10 rounded-full blur-sm"></div>
                        )}
                    </button>
                );
            })}
        </div>
      </div>
    </div>
  );
};