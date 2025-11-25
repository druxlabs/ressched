import { ResidentRotation, ResidentScheduleRaw, CallScheduleEntry, VacationRequest, VacationType, VacationStatus } from '../types';
import { parseDateRange, parseDateString } from '../utils/dateUtils';

// Storage Keys
const STORAGE_KEYS = {
  ROTATIONS: 'ophtho_rotations_csv',
  CALL: 'ophtho_call_csv',
  VACATION: 'ophtho_vacation_csv'
};

// Embedded Default CSV data
const DEFAULT_ROTATIONS_CSV = `Resident Year,Resident Name,Rotation Block,Rotation
PGY-2,Hadi Joud,7/1-8/8/25,Neuro
PGY-2,Hadi Joud,8/11-9/19/25,TGH
PGY-2,Hadi Joud,9/22-11/7/25,Plastics
PGY-2,Hadi Joud,11/10-12/26/25,RCG
PGY-2,Hadi Joud,12/29/25-2/6/26,Plastics
PGY-2,Hadi Joud,2/9-3/27/26,Neuro
PGY-2,Hadi Joud,3/30-5/8/26,TGH
PGY-2,Hadi Joud,5/11-6/30/26,RCG
PGY-2,Sama Nidhi,7/1-8/8/25,Plastics
PGY-2,Sama Nidhi,8/11-9/19/25,RCG
PGY-2,Sama Nidhi,9/22-11/7/25,Neuro
PGY-2,Sama Nidhi,11/10-12/26/25,TGH
PGY-2,Sama Nidhi,12/29/25-2/6/26,Neuro
PGY-2,Sama Nidhi,2/9-3/27/26,Plastics
PGY-2,Sama Nidhi,3/30-5/8/26,RCG
PGY-2,Sama Nidhi,5/11-6/30/26,TGH
PGY-2,John Musser,7/1-8/8/25,TGH
PGY-2,John Musser,8/11-9/19/25,Neuro
PGY-2,John Musser,9/22-11/7/25,RCG
PGY-2,John Musser,11/10-12/26/25,Plastics
PGY-2,John Musser,12/29/25-2/6/26,RCG
PGY-2,John Musser,2/9-3/27/26,TGH
PGY-2,John Musser,3/30-5/8/26,Plastics
PGY-2,John Musser,5/11-6/30/26,Neuro
PGY-2,Katherine Tsay,7/1-8/8/25,RCG
PGY-2,Katherine Tsay,8/11-9/19/25,Plastics
PGY-2,Katherine Tsay,9/22-11/7/25,TGH
PGY-2,Katherine Tsay,11/10-12/26/25,Neuro
PGY-2,Katherine Tsay,12/29/25-2/6/26,TGH
PGY-2,Katherine Tsay,2/9-3/27/26,RCG
PGY-2,Katherine Tsay,3/30-5/8/26,Neuro
PGY-2,Katherine Tsay,5/11-6/30/26,Plastics
PGY-3,Lea Carter,7/1-8/8/25,Peds
PGY-3,Lea Carter,8/11-9/19/25,Retina
PGY-3,Lea Carter,9/22-11/7/25,Cornea
PGY-3,Lea Carter,11/10-12/26/25,Glaucoma
PGY-3,Lea Carter,12/29/25-2/6/26,Peds
PGY-3,Lea Carter,2/9-3/27/26,Retina
PGY-3,Lea Carter,3/30-5/8/26,Cornea
PGY-3,Lea Carter,5/11-6/30/26,Glaucoma
PGY-3,Thomas King,7/1-8/8/25,Glaucoma
PGY-3,Thomas King,8/11-9/19/25,Cornea
PGY-3,Thomas King,9/22-11/7/25,Retina
PGY-3,Thomas King,11/10-12/26/25,Peds
PGY-3,Thomas King,12/29/25-2/6/26,Glaucoma
PGY-3,Thomas King,2/9-3/27/26,Cornea
PGY-3,Thomas King,3/30-5/8/26,Retina
PGY-3,Thomas King,5/11-6/30/26,Peds
PGY-3,Eunice Shin,7/1-8/8/25,Cornea
PGY-3,Eunice Shin,8/11-9/19/25,Peds
PGY-3,Eunice Shin,9/22-11/7/25,Glaucoma
PGY-3,Eunice Shin,11/10-12/26/25,Retina
PGY-3,Eunice Shin,12/29/25-2/6/26,Cornea
PGY-3,Eunice Shin,2/9-3/27/26,Peds
PGY-3,Eunice Shin,3/30-5/8/26,Glaucoma
PGY-3,Eunice Shin,5/11-6/30/26,Retina
PGY-3,Albert Xiong,7/1-8/8/25,Retina
PGY-3,Albert Xiong,8/11-9/19/25,Glaucoma
PGY-3,Albert Xiong,9/22-11/7/25,Peds
PGY-3,Albert Xiong,11/10-12/26/25,Cornea
PGY-3,Albert Xiong,12/29/25-2/6/26,Retina
PGY-3,Albert Xiong,2/9-3/27/26,Glaucoma
PGY-3,Albert Xiong,3/30-5/8/26,Peds
PGY-3,Albert Xiong,5/11-6/30/26,Cornea
PGY-4,Vishnu Adi,7/1-8/8/25,VA-4/VA Surgery
PGY-4,Vishnu Adi,8/11-9/19/25,VA-4/VA Surgery
PGY-4,Vishnu Adi,9/22-11/7/25,VA-5/VA Clinic
PGY-4,Vishnu Adi,11/10-12/26/25,VA-5/VA Clinic
PGY-4,Vishnu Adi,12/29/25-2/6/26,TGH-6 Consults
PGY-4,Vishnu Adi,2/9-3/27/26,TGH-5 S&G
PGY-4,Vishnu Adi,3/30-5/8/26,TGH-6 Consults
PGY-4,Vishnu Adi,5/11-6/30/26,TGH-5 S&G
PGY-4,Yasmin Ayoubi,7/1-8/8/25,TGH-6 Consults
PGY-4,Yasmin Ayoubi,8/11-9/19/25,TGH-5 S&G
PGY-4,Yasmin Ayoubi,9/22-11/7/25,TGH-5 S&G
PGY-4,Yasmin Ayoubi,11/10-12/26/25,TGH-6 Consults
PGY-4,Yasmin Ayoubi,12/29/25-2/6/26,VA-5/VA Clinic
PGY-4,Yasmin Ayoubi,2/9-3/27/26,VA-5/VA Clinic
PGY-4,Yasmin Ayoubi,3/30-5/8/26,VA-4/VA Surgery
PGY-4,Yasmin Ayoubi,5/11-6/30/26,VA-4/VA Surgery
PGY-4,David Drucker,7/1-8/8/25,TGH-5 S&G
PGY-4,David Drucker,8/11-9/19/25,TGH-6 Consults
PGY-4,David Drucker,9/22-11/7/25,VA-4/VA Surgery
PGY-4,David Drucker,11/10-12/26/25,VA-4/VA Surgery
PGY-4,David Drucker,12/29/25-2/6/26,TGH-5 S&G
PGY-4,David Drucker,2/9-3/27/26,TGH-6 Consults
PGY-4,David Drucker,3/30-5/8/26,VA-5/VA Clinic
PGY-4,David Drucker,5/11-6/30/26,VA-5/VA Clinic
PGY-4,Kim Menezes,7/1-8/8/25,VA-5/VA Clinic
PGY-4,Kim Menezes,8/11-9/19/25,VA-5/VA Clinic
PGY-4,Kim Menezes,9/22-11/7/25,TGH-6 Consults
PGY-4,Kim Menezes,11/10-12/26/25,TGH-5 S&G
PGY-4,Kim Menezes,12/29/25-2/6/26,VA-4/VA Surgery
PGY-4,Kim Menezes,2/9-3/27/26,VA-4/VA Surgery
PGY-4,Kim Menezes,3/30-5/8/26,TGH-5 S&G
PGY-4,Kim Menezes,5/11-6/30/26,TGH-6 Consults`;

const DEFAULT_CALL_CSV = `Date,Primary AM,Primary PM,Backup AM,Backup PM
12/1/2025,Nidhi,Kat,Yasmin,David
12/2/2025,Nidhi,Hadi,Yasmin,Yasmin
12/3/2025,Nidhi,Eunice,Yasmin,Yasmin
12/4/2025,Nidhi,Nidhi,Yasmin,Yasmin
12/5/2025,Nidhi,John,Yasmin,Lea
12/6/2025,Hadi,Hadi,Kim,Kim
12/7/2025,Lea,Tom,Yasmin,Yasmin
12/8/2025,Nidhi,Tom,Yasmin,Yasmin
12/9/2025,Nidhi,John,Yasmin,Yasmin
12/10/2025,Nidhi,Albert,Yasmin,David
12/11/2025,Nidhi,Eunice,Yasmin,Vishnu
12/12/2025,Nidhi,Nidhi,Yasmin,Lea
12/13/2025,Kat,Kat,Kim,Kim
12/14/2025,Hadi,Hadi,Vishnu,Vishnu
12/15/2025,Nidhi,Albert,Yasmin,David
12/16/2025,Nidhi,Nidhi,Yasmin,Vishnu
12/17/2025,Nidhi,Albert,Yasmin,Kim
12/18/2025,Nidhi,Eunice,Yasmin,Vishnu
12/19/2025,Nidhi,Hadi,Yasmin,David
12/20/2025,Nidhi,Nidhi,Lea,Lea
12/21/2025,Eunice,Albert,Tom,Tom
12/22/2025,Nidhi,Tom,Yasmin,Kim
12/23/2025,Nidhi,Kat,Yasmin,Kim
12/24/2025,Hadi,Hadi,Eunice,Eunice
12/25/2025,Nidhi,Nidhi,Albert,Albert
12/26/2025,Nidhi,Kat,Yasmin,Eunice
12/27/2025,John,John,Tom,Tom
12/28/2025,Nidhi,Nidhi,Tom,Tom
12/29/2025,Kat,John,Vishnu,Kim
12/30/2025,Kat,Kat,Vishnu,Eunice
12/31/2025,John,John,Tom,Tom`;

const DEFAULT_VACATION_CSV = `Name,Start Date,End Date,Type,Status
Hadi Joud,8/15/2025,8/20/2025,Annual,Approved
Sama Nidhi,11/24/2025,11/28/2025,Conference,Requested
Lea Carter,12/22/2025,12/26/2025,Annual,Approved
Thomas King,3/10/2026,3/14/2026,Annual,Requested
Vishnu Adi,9/1/2025,9/2/2025,Sick,Approved`;

const normalizeRotation = (rotation: string): string => {
  const r = rotation.trim();
  if (r === 'TGH-6 Consults') return 'TGH Senior';
  if (r === 'TGH-5 S&G') return 'Jarstad / Agi';
  if (r === 'VA-4/VA Surgery') return 'VA A (McDowell)';
  if (r === 'VA-5/VA Clinic') return 'VA B (Mercer)';
  return r;
};

// Helper: Parse Rotation CSV Content
const parseRotationsCsv = (csvContent: string): ResidentRotation[] => {
  const lines = csvContent.split('\n');
  const data: ResidentRotation[] = [];
  
  // Try to find the header row or assume first row is header if contains "Resident"
  const startIndex = lines[0].toLowerCase().includes('resident') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [year, name, block, rotation] = line.split(',').map(s => s.trim());
    if (!year || !name || !block || !rotation) continue;

    const parsedRange = parseDateRange(block);
    if (parsedRange) {
      data.push({
        id: `${name}-${i}`,
        year,
        name,
        rotation: normalizeRotation(rotation),
        rawBlock: block,
        startDate: parsedRange.start,
        endDate: parsedRange.end
      });
    }
  }
  return data;
};

// Helper: Parse Call CSV Content
const parseCallCsv = (csvContent: string): CallScheduleEntry[] => {
  const lines = csvContent.split('\n');
  const data: CallScheduleEntry[] = [];
  
  const startIndex = lines[0].toLowerCase().includes('primary') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    if (parts.length < 5) continue;
    
    const [dateStr, primaryAM, primaryPM, backupAM, backupPM] = parts.map(s => s.trim());
    const date = parseDateString(dateStr);

    if (date) {
      data.push({
        date,
        primaryAM,
        primaryPM,
        backupAM,
        backupPM
      });
    }
  }
  return data;
};

// Helper: Parse Vacation CSV Content
const parseVacationCsv = (csvContent: string): VacationRequest[] => {
  const lines = csvContent.split('\n');
  const data: VacationRequest[] = [];
  
  // Try to find the header row
  const startIndex = lines[0].toLowerCase().includes('start date') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSV: Name, Start, End, Type, Status
    const [name, startStr, endStr, typeStr, statusStr] = line.split(',').map(s => s.trim());
    
    const start = parseDateString(startStr);
    const end = parseDateString(endStr);
    
    if (name && start && end) {
      let type: VacationType = 'Annual';
      if (typeStr) {
        const t = typeStr.toLowerCase();
        if (t.includes('sick')) type = 'Sick';
        else if (t.includes('conference')) type = 'Conference';
        else if (t.includes('interview')) type = 'Interview';
        else if (t.includes('other')) type = 'Other';
      }
      
      let status: VacationStatus = 'Requested';
      if (statusStr) {
         const s = statusStr.toLowerCase();
         if (s.includes('approved')) status = 'Approved';
         else if (s.includes('rejected')) status = 'Rejected';
      }

      data.push({
        id: `${name}-vac-${i}`,
        name,
        startDate: start,
        endDate: end,
        type,
        status
      });
    }
  }
  return data;
};

// --- Exported Functions ---

export const saveCustomRotations = (csvContent: string) => {
  localStorage.setItem(STORAGE_KEYS.ROTATIONS, csvContent);
};

export const saveCustomCallSchedule = (csvContent: string) => {
  localStorage.setItem(STORAGE_KEYS.CALL, csvContent);
};

export const saveCustomVacation = (csvContent: string) => {
  localStorage.setItem(STORAGE_KEYS.VACATION, csvContent);
};

export const resetScheduleData = () => {
  localStorage.removeItem(STORAGE_KEYS.ROTATIONS);
  localStorage.removeItem(STORAGE_KEYS.CALL);
  localStorage.removeItem(STORAGE_KEYS.VACATION);
};

export const getResidentData = (): ResidentRotation[] => {
  // Try LocalStorage first
  const customData = localStorage.getItem(STORAGE_KEYS.ROTATIONS);
  if (customData) {
    try {
      const parsed = parseRotationsCsv(customData);
      if (parsed.length > 0) return parsed;
    } catch (e) {
      console.error("Error parsing custom rotations CSV", e);
    }
  }
  // Fallback to default
  return parseRotationsCsv(DEFAULT_ROTATIONS_CSV);
};

export const getCallSchedule = (): CallScheduleEntry[] => {
  // Try LocalStorage first
  const customData = localStorage.getItem(STORAGE_KEYS.CALL);
  if (customData) {
    try {
      const parsed = parseCallCsv(customData);
      if (parsed.length > 0) return parsed;
    } catch (e) {
      console.error("Error parsing custom call CSV", e);
    }
  }
  // Fallback to default
  return parseCallCsv(DEFAULT_CALL_CSV);
};

export const getVacationRequests = (): VacationRequest[] => {
  // Try LocalStorage first
  const customData = localStorage.getItem(STORAGE_KEYS.VACATION);
  if (customData) {
     try {
       const parsed = parseVacationCsv(customData);
       if (parsed.length > 0) return parsed;
     } catch (e) {
       console.error("Error parsing custom vacation CSV", e);
     }
  }
  // Fallback to default
  return parseVacationCsv(DEFAULT_VACATION_CSV);
};

// Check if currently using custom data
export const isUsingCustomData = () => {
  return !!(
    localStorage.getItem(STORAGE_KEYS.ROTATIONS) || 
    localStorage.getItem(STORAGE_KEYS.CALL) ||
    localStorage.getItem(STORAGE_KEYS.VACATION)
  );
};