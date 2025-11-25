/**
 * Parses a date string like "7/1", "8/8/25", "12/29/25", or "12/1/2025".
 * Helper for the range parser.
 */
const parseDatePart = (dateStr: string, defaultYear: number): Date => {
  const parts = dateStr.split('/');
  const month = parseInt(parts[0], 10) - 1; // JS months are 0-indexed
  const day = parseInt(parts[1], 10);
  
  let year = defaultYear;
  if (parts.length === 3) {
    const yearPart = parseInt(parts[2], 10);
    // Handle 2-digit (YY -> 20YY) vs 4-digit years (YYYY)
    year = yearPart < 100 ? 2000 + yearPart : yearPart;
  }

  return new Date(year, month, day);
};

/**
 * Parses a single date string into a Date object
 */
export const parseDateString = (dateStr: string): Date | null => {
  try {
    return parseDatePart(dateStr, new Date().getFullYear());
  } catch (e) {
    console.error("Failed to parse date:", dateStr, e);
    return null;
  }
};

/**
 * Parses a range string like "7/1-8/8/25" or "12/29/25-2/6/26"
 * Returns { start: Date, end: Date }
 */
export const parseDateRange = (rangeStr: string): { start: Date; end: Date } | null => {
  try {
    const [startStr, endStr] = rangeStr.split('-');
    
    if (!startStr || !endStr) return null;

    // Parse end date first to get the authoritative year
    const endParts = endStr.split('/');
    let endYear = new Date().getFullYear();
    if (endParts.length === 3) {
      const yr = parseInt(endParts[2], 10);
      endYear = yr < 100 ? 2000 + yr : yr;
    }
    
    const endDate = parseDatePart(endStr, endYear);
    
    // Parse start date. If it lacks a year, assume endYear initially.
    const startDate = parseDatePart(startStr, endYear);

    // Logic check: If Start > End (e.g. Start Dec 2025, End Jan 2025 - impossible), 
    // it means the Start date belongs to the previous year.
    if (startDate > endDate) {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Set times to start and end of day for accurate comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { start: startDate, end: endDate };
  } catch (e) {
    console.error("Failed to parse range:", rangeStr, e);
    return null;
  }
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const isDateInInterval = (checkDate: Date, start: Date, end: Date): boolean => {
  const check = new Date(checkDate);
  check.setHours(12, 0, 0, 0); // normalization
  
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  
  const e = new Date(end);
  e.setHours(23, 59, 59, 999);

  return check >= s && check <= e;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};