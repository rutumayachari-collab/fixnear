/**
 * Validates 10-digit Indian mobile numbers.
 * In India, mobile numbers start with 6, 7, 8, or 9 and are exactly 10 digits long.
 */
export const isValidIndianPhone = (phone: string): boolean => {
  const cleaned = phone.trim().replace(/^(\+91|91|0)/, '').replace(/\s+/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

/**
 * Validates 6-digit Indian PIN codes.
 * In India, postal PIN codes are 6 numeric digits, and the first digit cannot be 0.
 */
export const isValidIndianPincode = (pincode: string): boolean => {
  const cleaned = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
};

/**
 * Checks if the selected date is today or in the future.
 */
export const isFutureOrToday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateStr.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate >= today;
};

/**
 * Generates a standard unique FixNear booking ID (e.g., FN-84920)
 */
export const generateBookingId = (): string => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `FN-${num}`;
};
