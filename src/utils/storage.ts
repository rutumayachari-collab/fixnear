const STORAGE_KEYS = {
  BOOKINGS: 'fixnear_bookings_v1',
  PROVIDERS: 'fixnear_providers_v1',
  CURRENT_ROLE: 'fixnear_demo_role_v1',
  SELECTED_WORKER: 'fixnear_selected_worker_v1',
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger window storage event for potential cross-tab sync
    window.dispatchEvent(new Event('fixnear_storage_updated'));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
};

export const clearDemoStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.PROVIDERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_WORKER);
    window.dispatchEvent(new Event('fixnear_storage_updated'));
  } catch (error) {
    console.error('Error clearing demo storage:', error);
  }
};

export { STORAGE_KEYS };
