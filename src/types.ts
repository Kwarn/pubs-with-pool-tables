// Table interface
export interface Table {
  id: number;
  size: string | null;
  quality: string | null;
  cost: number | null;
  description: string | null;
  pubId: number;
}

// Rules interface
export interface Rules {
  id: number;
  isCueDeposit: string;
  isJumpingAllowed: string;
  isPoundOnTable: string;
  isReservationAllowed: string;
}

// User interface
export interface User {
  id: number;
  name: string | null; // Nullable fields in the database
  email: string;
  createdPubs?: Pub[]; // Optionally include relations
  updatedPubs?: Pub[]; // Optionally include relations
}

// MapLocation interface
export interface MapLocation {
  id: number;
  lat: number;
  lng: number;
  pubs?: Pub[]; // Optionally include relations
}

// Pub interface
export interface Pub {
  id: number;
  name: string;
  address: string;
  description: string;
  locationId: number; // Assuming this is a foreign key reference to MapLocation
  location: MapLocation; // Assuming a one-to-one relation with MapLocation
  rulesId: number; // Assuming this is a foreign key reference to Rules
  rules: Rules; // Assuming a one-to-one relation with Rules
  tables: Table[]; // Optionally include relations
  createdBy: string; // Assuming a one-to-one relation with User
  updatedBy?: User[]; // Optionally include relations
  userId: number; // Assuming this is a foreign key reference to User
}

export interface PubInput {
  name: string;
  address: string;
  description: string;
  location: MapLocation;
  rules: Rules;
  tables?: Table[];
  createdBy: string;
}
