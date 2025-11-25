import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onSelect, onClose }) => {
  const [viewDate, setViewDate] = useState(selectedDate);

  // Sync view date if selected date changes externally
  useEffect(() => {
    setViewDate(selectedDate);
  }, [selectedDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    onSelect(newDate);
    onClose();
  };

  const days = [];
  // Empty slots for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }
  
  // Days generation
  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(year, month, d);
    
    // Reset hours to compare dates correctly
    const isSelected = currentDate.toDateString() === selectedDate.toDateString();
    const isToday = currentDate.toDateString() === new Date().toDateString();

    days.push(
      <button
        key={d}
        onClick={(e) => { e.stopPropagation(); handleDayClick(d); }}
        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all duration-200
          ${isSelected 
            ? 'bg-usf-green text-white font-bold shadow-md' 
            : isToday 
              ? 'text-usf-green font-bold bg-usf-green/10 border border-usf-green/20' 
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
      >
        {d}
      </button>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="relative z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-[300px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4 px-1">
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-usf-green transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-slate-800 text-sm">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNextMonth(); }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-usf-green transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="h-8 w-8 flex items-center justify-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    </>
  );
};