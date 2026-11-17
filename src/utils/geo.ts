import { Coordinates } from '../types';

export const DEFAULT_PUNE_COORDS: Coordinates = {
  lat: 18.5204,
  lng: 73.8567, // Pune Center
};

/**
 * Calculates the approximate straight-line distance in kilometers
 * between two geographic coordinates using the standard Haversine formula.
 */
export const calculateDistanceKm = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // e.g. 2.4 km
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
 * Requests the customer's location via the browser Geolocation API.
 * ONLY triggered after an explicit user click.
 */
export const requestBrowserLocation = (): Promise<{
  coords: Coordinates;
  accuracy: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser. Please enter your PIN code instead.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMsg = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission was denied. Please enter your 6-digit PIN code to find nearby specialists.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is currently unavailable. Please search using your Indian PIN code.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Please enter your PIN code instead.';
            break;
        }
        reject(new Error(errorMsg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};
