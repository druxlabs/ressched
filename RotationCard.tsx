import React from 'react';
import { ResidentRotation } from '../types';
import { User, Calendar, Activity, Moon } from 'lucide-react';
import { getLocationInfo } from '../utils/locationUtils';

interface RotationCardProps {
  resident: ResidentRotation;
  isPostCall?: boolean;
  onClick?: () => void;
}

// Helper to generate deterministic colors based on rotation name
const getRotationColor = (rotation: string) => {
  const normalized = rotation.toLowerCase();
  if (normalized.includes('neuro')) return 'bg-purple-100 text-purple-800 border-purple-200';
  if (normalized.includes('plastics')) return 'bg-pink-100 text-pink-800 border-pink-200';
  // Include Jarstad/Agi in TGH blue/teal styling
  if (normalized.includes('tgh') || normalized.includes('jarstad')) return 'bg-teal-100 text-teal-800 border-teal-200';
  if (normalized.includes('rcg')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  // Use USF green tones for VA
  if (normalized.includes('va')) return 'bg-usf-green/10 text-usf-green border-usf-green/20';
  if (normalized.includes('peds')) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (normalized.includes('retina')) return 'bg-red-100 text-red-800 border-red-200';
  if (normalized.includes('cornea')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
  if (normalized.includes('glaucoma')) return 'bg-lime-100 text-lime-800 border-lime-200';
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

export const RotationCard: React.FC<RotationCardProps> = ({ resident, isPostCall = false, onClick }) => {
  const colorClass = getRotationColor(resident.rotation);
  const location = getLocationInfo(resident.rotation);

  const containerClasses = isPostCall
    ? "bg-usf-gold-light border-usf-gold relative overflow-hidden"
    : "bg-white border-slate-200";

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:border-usf-green/40 cursor-pointer group ${containerClasses}`}
    >
      {isPostCall && (
        <div className="absolute top-0 right-0">
          <div className="bg-usf-gold text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center shadow-sm">
            <Moon size={10} className="mr-1" /> Post-Call
          </div>
        </div>
      )}

      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full transition-colors ${isPostCall ? 'bg-white/50 text-usf-green' : 'bg-slate-100 text-slate-500 group-hover:bg-usf-green/10 group-hover:text-usf-green'}`}>
              <User size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 leading-tight group-hover:text-usf-green transition-colors">{resident.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{resident.year}</p>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded text-[10px] font-bold border ${location.className} flex items-center mr-6 md:mr-0`}>
            {location.label}
          </div>
        </div>
        
        <div className={`inline-flex items-center px-2.5 py-1 rounded-md border text-sm font-medium ${colorClass}`}>
          <Activity size={14} className="mr-1.5" />
          {resident.rotation}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-slate-400 text-xs">
        <Calendar size={12} className="mr-1.5" />
        <span>{resident.rawBlock}</span>
      </div>
    </div>
  );
};