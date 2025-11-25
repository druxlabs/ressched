export type LocationType = 'TGH' | 'VA' | 'Both';

export const getLocationType = (rotation: string): LocationType => {
  const r = rotation.toLowerCase();
  
  if (r.includes('neuro')) {
    return 'Both';
  }
  
  // VA Rotations: RCG, Plastics, VA-5, VA-4, VA A, VA B
  // Added check for "va " to capture "VA A" and "VA B" which don't have hyphens
  if (r.includes('rcg') || r.includes('plastics') || r.includes('va-') || r.includes('va ')) {
    return 'VA';
  }

  // Default to TGH for others
  return 'TGH';
};

export const getLocationInfo = (rotation: string) => {
  const type = getLocationType(rotation);
  
  switch (type) {
    case 'Both':
      return { label: 'Both', className: 'bg-slate-100 text-slate-600 border-slate-200' };
    case 'VA':
      return { label: 'VA', className: 'bg-usf-green/10 text-usf-green border-usf-green/20' };
    case 'TGH':
    default:
      return { label: 'TGH', className: 'bg-teal-50 text-teal-700 border-teal-100' };
  }
};