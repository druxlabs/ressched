import React from 'react';
import { CallScheduleEntry, ResidentRotation } from '../types';
import { isSameDay, isDateInInterval } from '../utils/dateUtils';
import { Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CallCalendarViewProps {
  currentDate: Date;
  callSchedule: CallScheduleEntry[];
  rotations: ResidentRotation[];
  onDateClick: (date: Date) => void;
  onResidentClick?: (name: string) => void;
}

export const CallCalendarView: React.FC<CallCalendarViewProps> = ({
  currentDate,
  callSchedule,
  rotations,
  onDateClick,
  onResidentClick
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    onDateClick(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onDateClick(new Date(year, month + 1, 1));
  };

  const days = [];
  // Empty slots for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="bg-slate-50/50 hidden md:block" />);
  }

  // Generate days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isToday = isSameDay(date, new Date());
    const isSelected = isSameDay(date, currentDate);

    // Get call data for this day
    const daySchedule = callSchedule.find(c => isSameDay(c.date, date));
    
    // Calculate VA Primary (Plastics) for this day
    const vaResidents = rotations
      .filter(r => 
        isDateInInterval(date, r.startDate, r.endDate) && 
        r.rotation.toLowerCase().includes('plastics')
      )
      .map(r => r.name);

    days.push(
      <div 
        key={d}
        onClick={() => onDateClick(date)}
        className={`
          min-h-[100px] border border-slate-200 p-2 transition-all cursor-pointer flex flex-col gap-1
          ${isSelected ? 'bg-usf-green/5 ring-2 ring-inset ring-usf-green z-10' : 'bg-white hover:bg-slate-50'}
        `}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`
            text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full
            ${isToday ? 'bg-usf-green text-white' : 'text-slate-700'}
          `}>
            {d}
          </span>
          {isToday && <span className="text-[10px] font-bold text-usf-green uppercase">Today</span>}
        </div>

        <div className="flex-1 space-y-1.5 overflow-hidden">
          {daySchedule ? (
            <>
              {/* Day Call Block */}
              <div className="bg-amber-50 rounded border border-amber-100 px-1.5 py-1">
                <div className="flex items-center text-[10px] text-amber-700 font-bold mb-0.5 uppercase">
                  <Sun size={10} className="mr-1" /> Day
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs truncate font-medium text-slate-800" title={`TGH: ${daySchedule.primaryAM}`}>
                    {daySchedule.primaryAM}
                  </div>
                  {vaResidents.length > 0 && (
                    <div className="text-xs truncate text-slate-500" title={`VA: ${vaResidents.join(', ')}`}>
                      VA: {vaResidents[0].split(' ')[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Night Call Block */}
              <div className="bg-usf-green/5 rounded border border-usf-green/20 px-1.5 py-1">
                 <div className="flex items-center text-[10px] text-usf-green font-bold mb-0.5 uppercase">
                  <Moon size={10} className="mr-1" /> Night
                </div>
                <div className="text-xs truncate font-bold text-usf-green" title={`PM: ${daySchedule.primaryPM}`}>
                  {daySchedule.primaryPM}
                </div>
                 <div className="text-[10px] truncate text-slate-400" title={`Backup: ${daySchedule.backupPM}`}>
                  ({daySchedule.backupPM})
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs text-slate-300 italic">No Data</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <button 
          onClick={handlePrevMonth}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          aria-label="Previous Month"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button 
          onClick={handleNextMonth}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          aria-label="Next Month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {weekDays.map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {days}
      </div>
    </div>
  );
};