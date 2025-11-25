import React, { useState, useMemo } from 'react';
import { getResidentData, getCallSchedule, getVacationRequests } from './services/scheduleService';
import { isDateInInterval, isSameDay } from './utils/dateUtils';
import { getLocationType } from './utils/locationUtils';
import { Header } from './components/Header';
import { DayOverview } from './components/DayOverview';
import { RotationCard } from './components/RotationCard';
import { CallScheduleCard } from './components/CallScheduleCard';
import { ResidentScheduleModal } from './components/ResidentScheduleModal';
import { CallCalendarView } from './components/CallCalendarView';
import { UploadModal } from './components/UploadModal';
import { VacationDashboard } from './components/VacationDashboard';
import { ResidentRotation } from './types';
import { Search, AlertCircle, LayoutGrid, MapPin, CalendarDays, Plane } from 'lucide-react';

const App: React.FC = () => {
  // Initialize date to current day by default
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'schedule' | 'vacation'>('schedule');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResidentName, setSelectedResidentName] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'class' | 'location' | 'calendar'>('class');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const allData = useMemo(() => getResidentData(), []);
  const callScheduleData = useMemo(() => getCallSchedule(), []);
  const vacationData = useMemo(() => getVacationRequests(), []);

  // 1. First filter by date to get all residents active on this day
  const residentsOnDate = useMemo(() => {
    return allData.filter(item => 
      isDateInInterval(selectedDate, item.startDate, item.endDate)
    );
  }, [allData, selectedDate]);

  // 2. Identify who is on Plastics (VA Primary Day Call) from the full daily list
  const plasticsResidents = useMemo(() => {
    return residentsOnDate
      .filter(r => r.rotation.toLowerCase().includes('plastics'))
      .map(r => r.name);
  }, [residentsOnDate]);

  // 3. Apply search filter for the main grid view
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return residentsOnDate;
    
    const lowerQuery = searchQuery.toLowerCase();
    return residentsOnDate.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.rotation.toLowerCase().includes(lowerQuery)
    );
  }, [residentsOnDate, searchQuery]);

  // Get call schedule for specific day
  const todaysCall = useMemo(() => {
    return callScheduleData.find(item => isSameDay(item.date, selectedDate));
  }, [callScheduleData, selectedDate]);

  // Determine who was on call the previous night (Primary PM and Backup PM of yesterday)
  const postCallNames = useMemo(() => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(selectedDate.getDate() - 1);
    
    const yesterdaysCall = callScheduleData.find(item => isSameDay(item.date, prevDate));
    if (!yesterdaysCall) return [];

    // Return names that were on PM call
    return [yesterdaysCall.primaryPM, yesterdaysCall.backupPM]
      .filter(Boolean)
      .map(name => name.toLowerCase());
  }, [callScheduleData, selectedDate]);

  const isResidentPostCall = (residentName: string) => {
    const lowerName = residentName.toLowerCase();
    // Simple fuzzy match: check if the call name (usually first name or nickname) 
    // is contained within the full resident name
    return postCallNames.some(callName => lowerName.includes(callName));
  };

  // Group by PGY Year or Location based on viewMode
  const groupedData = useMemo(() => {
    const groups: Record<string, ResidentRotation[]> = {};

    filteredData.forEach(item => {
      let key = '';
      if (viewMode === 'class') {
        key = item.year;
      } else {
        key = getLocationType(item.rotation);
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }, [filteredData, viewMode]);

  // Find all rotations and vacations for the selected resident
  const selectedResidentRotations = useMemo(() => {
    if (!selectedResidentName) return [];
    return allData.filter(r => r.name === selectedResidentName);
  }, [allData, selectedResidentName]);

  const selectedResidentVacations = useMemo(() => {
    if (!selectedResidentName) return [];
    return vacationData.filter(v => v.name.toLowerCase().includes(selectedResidentName.toLowerCase()) || selectedResidentName.toLowerCase().includes(v.name.toLowerCase()));
  }, [vacationData, selectedResidentName]);

  const handleResidentClick = (namePart: string) => {
    // Attempt to map a short name (like "Kat") to a full name in the database ("Katherine Tsay")
    if (!namePart) return;

    // 1. Exact match
    const exactMatch = allData.find(r => r.name.toLowerCase() === namePart.toLowerCase());
    if (exactMatch) {
      setSelectedResidentName(exactMatch.name);
      return;
    }

    // 2. Contains match (e.g. "Nidhi" in "Sama Nidhi", "Tom" in "Thomas King")
    const fuzzyMatch = allData.find(r => r.name.toLowerCase().includes(namePart.toLowerCase()));
    if (fuzzyMatch) {
      setSelectedResidentName(fuzzyMatch.name);
      return;
    }

    // 3. Fallback: If no resident record is found
    console.warn('Could not find resident record for:', namePart);
  };

  const hasResults = filteredData.length > 0;

  // Define section order based on view mode
  const sectionKeys = viewMode === 'class' 
    ? ['PGY-2', 'PGY-3', 'PGY-4']
    : ['TGH', 'VA', 'Both'];

  const getSectionTitle = (key: string) => {
    if (viewMode === 'class') return `${key} Residents`;
    if (key === 'Both') return 'Neuro (TGH & VA)';
    return `${key} Rotations`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
        onUploadClick={() => setIsUploadModalOpen(true)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      {currentView === 'schedule' && (
        <DayOverview 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6">
        
        {currentView === 'vacation' ? (
          <div className="max-w-6xl mx-auto">
             <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center">
                   <Plane className="mr-3 text-usf-green" /> Vacation Dashboard
                </h2>
                <p className="text-slate-500 mt-1">Manage and track resident time off requests and approvals.</p>
             </div>
             <VacationDashboard requests={vacationData} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Controls Bar: Search + View Toggles */}
            <div className="mb-8 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search residents or rotations..."
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-usf-green sm:text-sm shadow-sm transition-shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={viewMode === 'calendar'} // Disable search in calendar mode
                />
              </div>

              <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm shrink-0 overflow-x-auto">
                <button
                  onClick={() => setViewMode('class')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    viewMode === 'class' 
                      ? 'bg-usf-green text-white shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid size={16} className="mr-2" />
                  By Class
                </button>
                <button
                  onClick={() => setViewMode('location')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    viewMode === 'location' 
                      ? 'bg-usf-green text-white shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <MapPin size={16} className="mr-2" />
                  By Location
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    viewMode === 'calendar' 
                      ? 'bg-usf-green text-white shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <CalendarDays size={16} className="mr-2" />
                  Monthly Call
                </button>
              </div>
            </div>

            {viewMode === 'calendar' ? (
              <CallCalendarView 
                currentDate={selectedDate}
                callSchedule={callScheduleData}
                rotations={allData}
                onDateClick={setSelectedDate}
                onResidentClick={handleResidentClick}
              />
            ) : (
              <>
                {/* Daily Call Schedule Card */}
                {todaysCall && (
                  <div className="mb-8">
                    <CallScheduleCard 
                      schedule={todaysCall} 
                      vaResidents={plasticsResidents} 
                      onResidentClick={handleResidentClick}
                    />
                  </div>
                )}

                {/* Resident Grid View */}
                {!hasResults ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                      <AlertCircle className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No schedules found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      There may be no data for this date. 
                      <br/>
                      <span className="text-xs text-slate-400">
                        (Tip: Try December 2025 for call data, or July 2025 - June 2026 for rotations)
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {sectionKeys.map((key) => (
                      <section key={key} className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <h2 className="text-xl font-bold text-slate-800">{getSectionTitle(key)}</h2>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {groupedData[key]?.length || 0}
                          </span>
                        </div>
                        
                        {groupedData[key]?.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {groupedData[key].map(resident => (
                              <RotationCard 
                                key={resident.id} 
                                resident={resident} 
                                isPostCall={isResidentPostCall(resident.name)}
                                onClick={() => setSelectedResidentName(resident.name)}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 italic">No residents scheduled for {getSectionTitle(key)} on this date.</p>
                        )}
                      </section>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Ophthalmology Residency Program</p>
        </div>
      </footer>

      <ResidentScheduleModal 
        isOpen={!!selectedResidentName}
        onClose={() => setSelectedResidentName(null)}
        residentName={selectedResidentName || ''}
        rotations={selectedResidentRotations}
        vacationRequests={selectedResidentVacations}
        currentDate={selectedDate}
        callSchedule={callScheduleData}
      />

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
};

export default App;