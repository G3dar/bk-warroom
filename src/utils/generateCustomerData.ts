import type { GeneratedCustomer } from '../types/complaints';

// Diverse American first names
const firstNames = [
  'Marcus', 'Jennifer', 'Tyrone', 'Ashley', 'Carlos', 'Emily', 'Jamal', 'Sarah',
  'Michael', 'Jessica', 'DeShawn', 'Amanda', 'Luis', 'Brittany', 'David', 'Nicole',
  'Malik', 'Lauren', 'Roberto', 'Megan', 'Kevin', 'Stephanie', 'Terrell', 'Rachel',
  'Jose', 'Heather', 'Brandon', 'Kimberly', 'Andre', 'Christina', 'Daniel', 'Amber',
  'Darius', 'Tiffany', 'Miguel', 'Michelle', 'James', 'Lisa', 'Isaiah', 'Angela',
  'Juan', 'Maria', 'Tyler', 'Rebecca', 'Jalen', 'Laura', 'Anthony', 'Elizabeth',
  'Devin', 'Samantha', 'Christopher', 'Vanessa', 'Tremaine', 'Melissa', 'Ricardo', 'Amy'
];

// Common American last names
const lastNames = [
  'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
  'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez',
  'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

// Area codes by state
const areaCodes: Record<string, string[]> = {
  CA: ['213', '310', '415', '619', '650', '714'],
  TX: ['210', '214', '281', '512', '713', '817'],
  FL: ['305', '321', '407', '561', '727', '813'],
  NY: ['212', '315', '516', '518', '585', '718'],
  IL: ['217', '312', '630', '708', '773', '815'],
  PA: ['215', '267', '412', '484', '570', '610'],
  AZ: ['480', '520', '602', '623', '928'],
  NV: ['702', '725', '775'],
  WA: ['206', '253', '360', '425', '509'],
  MA: ['339', '413', '508', '617', '774', '781'],
  GA: ['229', '404', '470', '678', '706', '770'],
  CO: ['303', '719', '720', '970'],
  MI: ['231', '248', '269', '313', '517', '586'],
  OR: ['458', '503', '541', '971'],
  TN: ['423', '615', '629', '731', '865', '901'],
  NC: ['252', '336', '704', '828', '910', '919'],
  OH: ['216', '234', '330', '419', '440', '513'],
  IN: ['219', '260', '317', '574', '765', '812'],
};

// Simple seeded random number generator
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateCustomer(
  complaintId: number,
  state: string,
  stateAbbr: string,
  city: string
): GeneratedCustomer {
  // Use complaint ID as seed for consistency
  const firstNameIndex = Math.floor(seededRandom(complaintId * 7) * firstNames.length);
  const lastNameIndex = Math.floor(seededRandom(complaintId * 13) * lastNames.length);

  const firstName = firstNames[firstNameIndex];
  const lastName = lastNames[lastNameIndex];
  const name = `${firstName} ${lastName}`;

  // Generate phone number based on state
  const stateCodes = areaCodes[stateAbbr] || ['555'];
  const areaCodeIndex = Math.floor(seededRandom(complaintId * 17) * stateCodes.length);
  const areaCode = stateCodes[areaCodeIndex];

  const exchange = Math.floor(seededRandom(complaintId * 23) * 900) + 100;
  const lineNumber = Math.floor(seededRandom(complaintId * 31) * 9000) + 1000;

  const phone = `(${areaCode}) ${exchange}-${lineNumber}`;

  return {
    name,
    phone,
    state,
    stateAbbr,
    city,
  };
}
