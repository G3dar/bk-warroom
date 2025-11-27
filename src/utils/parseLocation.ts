import type { LocationData } from '../types/complaints';

// Mapping of major US cities to states
const cityToState: Record<string, { state: string; abbr: string }> = {
  // California
  'los angeles': { state: 'California', abbr: 'CA' },
  'san francisco': { state: 'California', abbr: 'CA' },
  'san diego': { state: 'California', abbr: 'CA' },
  'sacramento': { state: 'California', abbr: 'CA' },
  'oakland': { state: 'California', abbr: 'CA' },

  // Texas
  'houston': { state: 'Texas', abbr: 'TX' },
  'dallas': { state: 'Texas', abbr: 'TX' },
  'austin': { state: 'Texas', abbr: 'TX' },
  'san antonio': { state: 'Texas', abbr: 'TX' },

  // Florida
  'miami': { state: 'Florida', abbr: 'FL' },
  'orlando': { state: 'Florida', abbr: 'FL' },
  'tampa': { state: 'Florida', abbr: 'FL' },
  'jacksonville': { state: 'Florida', abbr: 'FL' },

  // New York
  'new york': { state: 'New York', abbr: 'NY' },
  'buffalo': { state: 'New York', abbr: 'NY' },
  'rochester': { state: 'New York', abbr: 'NY' },
  'brooklyn': { state: 'New York', abbr: 'NY' },
  'queens': { state: 'New York', abbr: 'NY' },

  // Illinois
  'chicago': { state: 'Illinois', abbr: 'IL' },

  // Pennsylvania
  'philadelphia': { state: 'Pennsylvania', abbr: 'PA' },
  'pittsburgh': { state: 'Pennsylvania', abbr: 'PA' },

  // Arizona
  'phoenix': { state: 'Arizona', abbr: 'AZ' },
  'tucson': { state: 'Arizona', abbr: 'AZ' },

  // Nevada
  'las vegas': { state: 'Nevada', abbr: 'NV' },

  // Washington
  'seattle': { state: 'Washington', abbr: 'WA' },

  // Massachusetts
  'boston': { state: 'Massachusetts', abbr: 'MA' },

  // Georgia
  'atlanta': { state: 'Georgia', abbr: 'GA' },

  // Colorado
  'denver': { state: 'Colorado', abbr: 'CO' },

  // Michigan
  'detroit': { state: 'Michigan', abbr: 'MI' },

  // Oregon
  'portland': { state: 'Oregon', abbr: 'OR' },

  // Tennessee
  'nashville': { state: 'Tennessee', abbr: 'TN' },
  'memphis': { state: 'Tennessee', abbr: 'TN' },

  // North Carolina
  'charlotte': { state: 'North Carolina', abbr: 'NC' },

  // Ohio
  'columbus': { state: 'Ohio', abbr: 'OH' },
  'cleveland': { state: 'Ohio', abbr: 'OH' },

  // Indiana
  'indianapolis': { state: 'Indiana', abbr: 'IN' },
};

export function parseLocation(locationString: string | undefined): LocationData {
  if (!locationString) {
    return {
      city: 'Unknown',
      state: 'Unknown',
      stateAbbr: 'XX',
      raw: 'Unknown',
    };
  }

  const normalized = locationString.toLowerCase().trim();
  const parts = normalized.split(',').map((p) => p.trim());

  let street: string | undefined;
  let city: string;
  let state: string;
  let stateAbbr: string;

  if (parts.length >= 2) {
    // Format: "street, city" or "city, state"
    const firstPart = parts[0];
    const secondPart = parts[1];

    // Check if second part is a city we know
    const cityMatch = cityToState[secondPart];
    if (cityMatch) {
      street = firstPart;
      city = secondPart;
      state = cityMatch.state;
      stateAbbr = cityMatch.abbr;
    } else {
      // Assume first part is city
      const cityMatch2 = cityToState[firstPart];
      if (cityMatch2) {
        city = firstPart;
        state = cityMatch2.state;
        stateAbbr = cityMatch2.abbr;
      } else {
        // Unknown format, use parts as-is
        city = firstPart;
        state = secondPart;
        stateAbbr = secondPart.slice(0, 2).toUpperCase();
      }
    }
  } else {
    // Single part - check if it's a known city
    const cityMatch = cityToState[normalized];
    if (cityMatch) {
      city = normalized;
      state = cityMatch.state;
      stateAbbr = cityMatch.abbr;
    } else {
      city = normalized;
      state = 'Unknown';
      stateAbbr = 'XX';
    }
  }

  // Capitalize city name
  city = city
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (street) {
    street = street
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return {
    street,
    city,
    state,
    stateAbbr,
    raw: locationString,
  };
}
