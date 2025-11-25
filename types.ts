export interface ResidentScheduleRaw {
  year: string;
  name: string;
  block: string;
  rotation: string;
}

export interface ResidentRotation {
  id: string;
  year: string;
  name: string;
  rotation: string;
  startDate: Date;
  endDate: Date;
  rawBlock: string;
}

export interface CallScheduleEntry {
  date: Date;
  primaryAM: string;
  primaryPM: string;
  backupAM: string;
  backupPM: string;
}

export type VacationType = 'Annual' | 'Sick' | 'Conference' | 'Interview' | 'Other';
export type VacationStatus = 'Requested' | 'Approved' | 'Rejected';

export interface VacationRequest {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: VacationType;
  status: VacationStatus;
}

export type PgyGroup = {
  [key: string]: ResidentRotation[];
};

export type Stats = {
  totalOnService: number;
  rotationCounts: Record<string, number>;
};