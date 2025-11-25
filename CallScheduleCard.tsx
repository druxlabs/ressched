import React from 'react';
import { CallScheduleEntry } from '../types';
import { Sun, Moon, Phone, Star, Shield } from 'lucide-react';

interface CallScheduleCardProps {
  schedule?: CallScheduleEntry;
  vaResidents?: string[];
  onResidentClick?: (name: string) => void;
}

export const CallScheduleCard: React.FC<CallScheduleCardProps> = ({ 
  schedule, 
  vaResidents = [],
  onResidentClick 
}) => {
  if (!schedule) return null;

  const ClickableName: React.FC<{ name: string; className?: string }> = ({ name, className = "" }) => {
    if (!name || name === 'None') return <span className="text-slate-400 italic font-normal">None</span>;
    
    return (
      <button 
        onClick={() => onResidentClick?.(name)}
        className={`hover:text-usf-green hover:underline cursor-pointer text-left transition-colors ${className}`}
      >
        {name}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
         <Phone className="w-5 h-5 mr-2 text-usf-green"/> On Call
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* AM Section - Day */}
        <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 flex flex-col h-full">
           <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-white rounded-md text-amber-500 shadow-sm border border-amber-100">
                <Sun size={16} />
              </div>
              <span className="font-bold text-sm text-slate-700 uppercase tracking-wide">AM (Day)</span>
           </div>
           
           <div className="grid grid-cols-2 gap-3 flex-1">
              {/* TGH Primary - Highlighted */}
              <div className="bg-white rounded-lg p-3 border-l-4 border-l-amber-400 border-y border-r border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                 <div className="flex items-center justify-between mb-1.5">
                   <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">TGH PRIMARY</div>
                   <Star size={12} className="text-amber-400 fill-amber-400" />
                 </div>
                 <div className="font-bold text-slate-900 truncate text-lg" title={schedule.primaryAM}>
                   <ClickableName name={schedule.primaryAM} />
                 </div>
              </div>

              {/* VA Primary - Highlighted */}
              <div className="bg-white rounded-lg p-3 border-l-4 border-l-amber-400 border-y border-r border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                 <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">VA PRIMARY</div>
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                 </div>
                 <div className="font-bold text-slate-900 truncate text-lg">
                    {vaResidents.length > 0 ? (
                      <div className="flex flex-col">
                        {vaResidents.map(name => (
                          <ClickableName key={name} name={name} />
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-300 italic text-sm">None</span>
                    )}
                 </div>
              </div>

              {/* Backup - Subdued */}
              <div className="col-span-2 bg-slate-50/80 rounded-lg p-3 border border-slate-200">
                 <div className="flex items-center gap-1.5 mb-1">
                    <Shield size={12} className="text-slate-400" />
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">BACKUP</div>
                 </div>
                 <div className="font-medium text-slate-600 truncate pl-5" title={schedule.backupAM}>
                    <ClickableName name={schedule.backupAM} />
                 </div>
              </div>
           </div>
        </div>

        {/* PM Section - Night */}
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex flex-col h-full">
           <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-white rounded-md text-emerald-600 shadow-sm border border-emerald-100">
                <Moon size={16} />
              </div>
              <span className="font-bold text-sm text-slate-700 uppercase tracking-wide">PM (Night)</span>
           </div>
           
           <div className="grid grid-cols-2 gap-3 flex-1">
              {/* Primary - Highlighted */}
              <div className="bg-white rounded-lg p-3 border-l-4 border-l-usf-green border-y border-r border-slate-100 shadow-sm col-span-2 transition-transform hover:scale-[1.02]">
                 <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">PRIMARY</div>
                    <Star size={12} className="text-usf-green fill-usf-green" />
                 </div>
                 <div className="font-bold text-slate-900 truncate text-lg" title={schedule.primaryPM}>
                    <ClickableName name={schedule.primaryPM} />
                 </div>
                 <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-usf-green/60"></div> Covers TGH, VA, & Moffitt
                 </div>
              </div>

              {/* Backup - Subdued */}
              <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200 col-span-2">
                 <div className="flex items-center gap-1.5 mb-1">
                    <Shield size={12} className="text-slate-400" />
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">BACKUP</div>
                 </div>
                 <div className="font-medium text-slate-600 truncate pl-5" title={schedule.backupPM}>
                    <ClickableName name={schedule.backupPM} />
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};