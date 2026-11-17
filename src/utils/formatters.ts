/**
 * Formats a number into Indian Rupee currency representation.
 * Examples: 199 -> ₹199, 1500 -> ₹1,500, 12000 -> ₹12,000
 */
export const formatINR = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats an ISO string or YYYY-MM-DD into readable Indian date format:
 * Example: "2026-10-27" -> "27 Oct 2026"
 */
export const formatDateIndian = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
      // If it's a simple YYYY-MM-DD string that might have timezone quirk
      if (typeof dateInput === 'string' && dateInput.includes('-')) {
        const parts = dateInput.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const monthIndex = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${day.toString().padStart(2, '0')} ${monthNames[monthIndex]} ${year}`;
        }
      }
      return String(dateInput);
    }
    
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateInput);
  }
};

/**
 * Formats an Indian phone number for clean readability:
 * Example: "9822012345" -> "+91 98220 12345"
 */
export const formatIndianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

/**
 * Formats distance in km with clear indication of straight-line estimation.
 */
export const formatDistance = (km?: number): string => {
  if (km === undefined || isNaN(km)) return '';
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
};

/**
 * Helper to get clean initials for avatar fallback
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
