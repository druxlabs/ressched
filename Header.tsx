import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CalendarCheck, UploadCloud, Plane, LayoutDashboard } from 'lucide-react';
import { DatePicker } from './DatePicker';

interface HeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onUploadClick: () => void;
  currentView: 'schedule' | 'vacation';
  onViewChange: (view: 'schedule' | 'vacation') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  selectedDate, 
  onDateChange, 
  onUploadClick,
  currentView,
  onViewChange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  // Format for display
  const formattedDate = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-usf-green p-1.5 rounded-lg shadow-sm hidden md:block">
            <CalendarIcon className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden md:block">Ophthalmology Resident Schedules</h1>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight md:hidden">Ophtho Schedules</h1>
        </div>

        {/* Center Navigation Tabs */}
        <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200 absolute left-1/2 -translate-x-1/2">
            <button
                onClick={() => onViewChange('schedule')}
                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                    currentView === 'schedule' 
                    ? 'bg-white text-usf-green shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <LayoutDashboard size={16} className="mr-2" />
                Daily Schedule
            </button>
            <button
                onClick={() => onViewChange('vacation')}
                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                    currentView === 'vacation' 
                    ? 'bg-white text-usf-green shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Plane size={16} className="mr-2" />
                Vacations
            </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
           {/* Mobile View Toggle (Simplified) */}
           <div className="md:hidden flex bg-slate-100 p-1 rounded-lg">
              <button 
                  onClick={() => onViewChange('schedule')}
                  className={`p-1.5 rounded ${currentView === 'schedule' ? 'bg-white shadow' : 'text-slate-500'}`}
              >
                  <LayoutDashboard size={18} />
              </button>
              <button 
                  onClick={() => onViewChange('vacation')}
                  className={`p-1.5 rounded ${currentView === 'vacation' ? 'bg-white shadow' : 'text-slate-500'}`}
              >
                  <Plane size={18} />
              </button>
           </div>

           <button
            onClick={onUploadClick}
            className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-usf-green rounded-md transition-colors border border-slate-200"
            title="Upload CSV Data"
          >
            <UploadCloud size={18} className="sm:mr-1.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {currentView === 'schedule' && (
            <>
              <button
                onClick={handleToday}
                className="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium text-usf-green bg-usf-green/10 hover:bg-usf-green/20 rounded-md transition-colors border border-transparent"
              >
                <CalendarCheck size={16} className="mr-1.5" />
                Today
              </button>

              <div className="flex items-center bg-slate-100 rounded-lg p-1 relative">
                <button 
                  onClick={handlePrevDay}
                  className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-600 hover:text-usf-green transition-all"
                  aria-label="Previous Day"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="relative mx-1">
                   <button 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="px-2 sm:px-4 py-1.5 text-sm font-semibold text-slate-700 hover:text-usf-green hover:bg-white rounded-md transition-all flex items-center min-w-[140px] justify-center"
                  >
                    {formattedDate}
                  </button>

                  {isCalendarOpen && (
                    <div className="absolute top-full mt-3 right-0 sm:left-1/2 sm:-translate-x-1/2 z-50">
                      <DatePicker 
                        selectedDate={selectedDate}
                        onSelect={(d) => {
                          onDateChange(d);
                          setIsCalendarOpen(false);
                        }}
                        onClose={() => setIsCalendarOpen(false)}
                      />
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleNextDay}
                  className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-600 hover:text-usf-green transition-all"
                  aria-label="Next Day"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};