import { Location } from '../types';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

export const getCurrentCoordinates = (
  options: PositionOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error),
      options
    );
  });
};

export const reverseGeocodeLocation = async (
  latitude: number,
  longitude: number
): Promise<Pick<Location, 'city' | 'country'>> => {
  try {
    const params = new URLSearchParams({
      format: 'json',
      lat: String(latitude),
      lon: String(longitude),
      zoom: '10',
      addressdetails: '1'
    });

    const response = await fetch(`${NOMINATIM_REVERSE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status ${response.status}`);
    }

    const data = await response.json();
    const city = data?.address?.city ?? data?.address?.town ?? data?.address?.village;
    const country = data?.address?.country;

    return {
      city: typeof city === 'string' ? city : undefined,
      country: typeof country === 'string' ? country : undefined
    };
  } catch {
    return {};
  }
};

export const detectCurrentLocation = async (
  options?: PositionOptions
): Promise<Location> => {
  const coordinates = await getCurrentCoordinates(options);
  const resolvedAddress = await reverseGeocodeLocation(coordinates.latitude, coordinates.longitude);

  return {
    ...coordinates,
    ...resolvedAddress
  };
};
