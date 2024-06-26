export interface Table {
  id: number;
  size: string | null;
  quality: string | null;
  cost: number | null;
  description: string | null;
  pubId: number;
}

export interface Rules {
  id: number;
  isCueDeposit: string;
  isJumpingAllowed: string;
  isPoundOnTable: string;
  isReservationAllowed: string;
}

export interface User {
  id: number;
  name: string | null;
  email: string;
  createdPubs?: Pub[];
  updatedPubs?: Pub[];
}

export interface MapLocation {
  id: number;
  lat: number;
  lng: number;
  pubs?: Pub[];
}

export interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: Date;
  pubId: number;
}

export interface Pub {
  id: number;
  name: string;
  address: string;
  description: string;
  locationId: number;
  location: MapLocation;
  rulesId: number;
  rules: Rules;
  tables: Table[];
  comments: Comment[];
  createdBy: string;
  updatedBy?: User[];
  userId: number;
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

export interface CommentInput {
  text: string;
  author: string;
  pubId: number;
}
