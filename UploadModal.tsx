import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Check, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { saveCustomCallSchedule, saveCustomRotations, saveCustomVacation, resetScheduleData, isUsingCustomData } from '../services/scheduleService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [rotationsFile, setRotationsFile] = useState<File | null>(null);
  const [callFile, setCallFile] = useState<File | null>(null);
  const [vacationFile, setVacationFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isCustom, setIsCustom] = useState(isUsingCustomData());

  const rotationInputRef = useRef<HTMLInputElement>(null);
  const callInputRef = useRef<HTMLInputElement>(null);
  const vacationInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'rotations' | 'call' | 'vacation') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file.');
        return;
      }
      
      setError(null);
      if (type === 'rotations') setRotationsFile(file);
      else if (type === 'call') setCallFile(file);
      else setVacationFile(file);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleSave = async () => {
    try {
      let updated = false;

      if (rotationsFile) {
        const content = await readFileContent(rotationsFile);
        saveCustomRotations(content);
        updated = true;
      }

      if (callFile) {
        const content = await readFileContent(callFile);
        saveCustomCallSchedule(content);
        updated = true;
      }

      if (vacationFile) {
        const content = await readFileContent(vacationFile);
        saveCustomVacation(content);
        updated = true;
      }

      if (updated) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload(); // Reload to refresh data sources
        }, 1000);
      } else {
        setError("Please select at least one file to upload.");
      }
    } catch (err) {
      setError("Failed to read file. Please try again.");
      console.error(err);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete custom files and revert to the default schedule?")) {
      resetScheduleData();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-usf-green" />
            Upload Schedules
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm">
              <AlertCircle size={16} className="mr-2 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center text-sm">
              <Check size={16} className="mr-2 shrink-0" />
              Upload successful! Reloading...
            </div>
          )}

          {/* Rotations Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rotation Schedule (CSV)
            </label>
            <div 
              onClick={() => rotationInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors text-center
                ${rotationsFile ? 'border-usf-green/40 bg-usf-green/5' : 'border-slate-300 hover:border-usf-green/40 hover:bg-slate-50'}
              `}
            >
              <input 
                type="file" 
                ref={rotationInputRef}
                className="hidden" 
                accept=".csv"
                onChange={(e) => handleFileChange(e, 'rotations')}
              />
              {rotationsFile ? (
                <div className="flex items-center justify-center text-usf-green font-medium">
                  <FileText size={20} className="mr-2" />
                  {rotationsFile.name}
                </div>
              ) : (
                <div className="text-slate-500 text-sm">
                  <p className="font-medium text-slate-700">Click to upload rotation file</p>
                  <p className="text-xs mt-1">Format: Year, Name, Block (Date-Date), Rotation</p>
                </div>
              )}
            </div>
          </div>

          {/* Call Schedule Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Call Schedule (CSV)
            </label>
            <div 
               onClick={() => callInputRef.current?.click()}
               className={`
                 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors text-center
                 ${callFile ? 'border-usf-green/40 bg-usf-green/5' : 'border-slate-300 hover:border-usf-green/40 hover:bg-slate-50'}
               `}
            >
              <input 
                type="file" 
                ref={callInputRef}
                className="hidden" 
                accept=".csv"
                onChange={(e) => handleFileChange(e, 'call')}
              />
               {callFile ? (
                <div className="flex items-center justify-center text-usf-green font-medium">
                  <FileText size={20} className="mr-2" />
                  {callFile.name}
                </div>
              ) : (
                <div className="text-slate-500 text-sm">
                  <p className="font-medium text-slate-700">Click to upload call schedule file</p>
                  <p className="text-xs mt-1">Format: Date, Primary AM, Primary PM, Backup AM...</p>
                </div>
              )}
            </div>
          </div>

          {/* Vacation Schedule Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Vacation Requests (CSV)
            </label>
            <div 
               onClick={() => vacationInputRef.current?.click()}
               className={`
                 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors text-center
                 ${vacationFile ? 'border-usf-green/40 bg-usf-green/5' : 'border-slate-300 hover:border-usf-green/40 hover:bg-slate-50'}
               `}
            >
              <input 
                type="file" 
                ref={vacationInputRef}
                className="hidden" 
                accept=".csv"
                onChange={(e) => handleFileChange(e, 'vacation')}
              />
               {vacationFile ? (
                <div className="flex items-center justify-center text-usf-green font-medium">
                  <FileText size={20} className="mr-2" />
                  {vacationFile.name}
                </div>
              ) : (
                <div className="text-slate-500 text-sm">
                  <p className="font-medium text-slate-700">Click to upload vacation file</p>
                  <p className="text-xs mt-1">Format: Name, Start Date, End Date, Type, Status</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center sticky bottom-0">
          {isCustom ? (
             <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} className="mr-2" />
              Reset Defaults
            </button>
          ) : (
            <div></div> // Spacer
          )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white border border-transparent hover:border-slate-300 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={(!rotationsFile && !callFile && !vacationFile) || success}
              className="flex items-center px-4 py-2 text-sm font-bold text-white bg-usf-green hover:bg-[#004e36] rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {success ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : null}
              {success ? 'Reloading...' : 'Save & Reload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};