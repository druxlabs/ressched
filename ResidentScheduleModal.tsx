import React, { useRef, useEffect, useMemo } from 'react';
import { ResidentRotation, CallScheduleEntry, VacationRequest } from '../types';
import { X, Calendar, Activity, Phone, Sun, Moon, Plane, CheckCircle2, Clock } from 'lucide-react';
import { isDateInInterval } from '../utils/dateUtils';
import { getLocationInfo } from '../utils/locationUtils';

interface ResidentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  residentName: string;
  rotations: ResidentRotation[];
  vacationRequests?: VacationRequest[];
  currentDate: Date;
  callSchedule: CallScheduleEntry[];
}

export const ResidentScheduleModal: React.FC<ResidentScheduleModalProps> = ({
  isOpen,
  onClose,
  residentName,
  rotations,
  vacationRequests = [],
  currentDate,
  callSchedule
}) => {
  const currentRotationRef = useRef<HTMLDivElement>(null);

  // Scroll to current rotation when modal opens
  useEffect(() => {
    if (isOpen && currentRotationRef.current) {
      setTimeout(() => {
        currentRotationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [isOpen]);

  // Compute upcoming calls
  const upcomingCalls = useMemo(() => {
    if (!callSchedule) return [];

    const matches = (entryName: string) => {
        if (!entryName || entryName === 'None') return false;
        return residentName.toLowerCase().includes(entryName.toLowerCase());
    };

    return callSchedule.filter(entry => {
        // Filter out past dates (relative to currentDate prop)
        const entryTime = new Date(entry.date);
        entryTime.setHours(0,0,0,0);
        const currTime = new Date(currentDate);
        currTime.setHours(0,0,0,0);
        
        if (entryTime < currTime) return false;

        const day = entry.date.getDay();
        const isWeekend = day === 0 || day === 6;
        
        const isPM = matches(entry.primaryPM);
        const isAM = isWeekend && matches(entry.primaryAM);
        
        return isPM || isAM;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [callSchedule, residentName, currentDate]);

  const sortedVacations = useMemo(() => {
    return [...vacationRequests].sort((a, b) => b.startDate.getTime() - a.startDate.getTime()); // Newest first
  }, [vacationRequests]);

  if (!isOpen) return null;

  // Sort by start date
  const sortedRotations = [...rotations].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Get resident year from first rotation (assuming consistent)
  const residentYear = rotations.length > 0 ? rotations[0].year : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{residentName}</h2>
            <p className="text-sm text-slate-500 font-medium">{residentYear} Schedule Overview</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-usf-green"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 scroll-smooth">
          
          {/* Upcoming Call Shifts Section */}
          {upcomingCalls.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-usf-green" /> Upcoming Call Shifts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingCalls.map((entry, idx) => {
                   const matches = (entryName: string) => residentName.toLowerCase().includes((entryName || '').toLowerCase());
                   const isWeekend = entry.date.getDay() === 0 || entry.date.getDay() === 6;
                   const isPM = matches(entry.primaryPM);
                   const isAM = isWeekend && matches(entry.primaryAM);

                   return (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isPM ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {isPM ? <Moon size={16}/> : <Sun size={16}/>}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              {entry.date.toLocaleDateString('en-US', { weekday: 'long' })}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {isPM && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Night</span>}
                          {isAM && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Day</span>}
                        </div>
                      </div>
                   );
                })}
              </div>
            </div>
          )}

          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center">
             <Activity className="w-4 h-4 mr-2 text-usf-green"/> Rotation Timeline
          </h3>
          
          <div className="space-y-0">
            {sortedRotations.map((rot, idx) => {
              const isCurrent = isDateInInterval(currentDate, rot.startDate, rot.endDate);
              const isPast = rot.endDate < currentDate && !isCurrent;
              const locationInfo = getLocationInfo(rot.rotation);
              
              return (
                <div 
                  key={rot.id} 
                  ref={isCurrent ? currentRotationRef : null}
                  className="flex gap-4"
                >
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center min-w-[24px]">
                    <div className={`w-0.5 grow ${idx === 0 ? 'bg-transparent h-4' : 'bg-slate-200'}`} />
                    <div className={`
                      w-3 h-3 rounded-full border-2 shrink-0 my-1 z-10
                      ${isCurrent ? 'bg-usf-green border-usf-green ring-4 ring-usf-green/20' : isPast ? 'bg-slate-300 border-slate-300' : 'bg-white border-slate-300'}
                    `} />
                    <div className={`w-0.5 grow ${idx === sortedRotations.length - 1 ? 'bg-transparent' : 'bg-slate-200'}`} />
                  </div>

                  {/* Content */}
                  <div className={`pb-6 grow ${idx === sortedRotations.length - 1 ? 'pb-2' : ''}`}>
                    <div 
                      className={`
                        p-4 rounded-xl border transition-all
                        ${isCurrent 
                          ? 'bg-usf-green/5 border-usf-green/20 shadow-md ring-1 ring-usf-green/20' 
                          : 'bg-white border-slate-100 hover:border-slate-200'}
                      `}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Activity size={16} className={isCurrent ? 'text-usf-green' : 'text-slate-400'} />
                            <span className={`font-bold text-lg ${isCurrent ? 'text-usf-green' : 'text-slate-700'}`}>
                              {rot.rotation}
                            </span>
                            {isCurrent && (
                              <span className="bg-usf-green/10 text-usf-green text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-slate-500 font-medium">
                            <Calendar size={14} className="mr-1.5" />
                            {rot.rawBlock}
                          </div>
                        </div>
                        
                        <div className={`
                           text-xs font-semibold px-2 py-1 rounded border
                           ${locationInfo.className}
                        `}>
                          {locationInfo.label}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vacation / Time Off Section */}
          {sortedVacations.length > 0 && (
             <div className="mt-8 pt-8 border-t border-slate-100">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center">
                  <Plane className="w-4 h-4 mr-2 text-usf-green"/> Time Off Requests
               </h3>
               <div className="space-y-3">
                 {sortedVacations.map(vac => (
                   <div key={vac.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
                      <div className="flex items-start gap-3">
                         <div className={`p-2 rounded-lg ${vac.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {vac.status === 'Approved' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                         </div>
                         <div>
                            <div className="font-bold text-slate-800">{vac.type} Leave</div>
                            <div className="text-xs text-slate-500">
                               {vac.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - {vac.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                         </div>
                      </div>
                      <div>
                        <span className={`
                          text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border
                          ${vac.status === 'Approved' 
                             ? 'bg-green-50 text-green-700 border-green-200' 
                             : vac.status === 'Rejected'
                               ? 'bg-red-50 text-red-700 border-red-200'
                               : 'bg-amber-50 text-amber-700 border-amber-200'
                          }
                        `}>
                          {vac.status}
                        </span>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};