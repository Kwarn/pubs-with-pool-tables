export interface PubInformation {
  id: number;
  numberOfTables: number | null;
  tableQuality: string | null;
  tableCost: number | null;
  cueQuality: string | null;
  hasChalk: string | null;
  wheelchairAccess: string | null;
  kidsFriendly: string | null;
  pubId?: number;
}

export interface Table {
  id: number;
  size: string | null;
  quality: string | null;
  cost: number | null;
  description: string | null;
  pubId: number;
}

export interface Rules {
  id?: number;
  isCueDeposit: string;
  isJumpingAllowed: string;
  isPoundOnTable: string;
  isReservationAllowed: string;
}

export interface MapLocation {
  id?: number;
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
  locationId: number;
  location: MapLocation;
  rulesId: number;
  rules: Rules;
  tables?: Table[];
  comments?: Comment[];
  createdBy: string;
  updatedBy?: User[];
  userId: number;
  isRequiresManualReview: boolean;
  pubInformation?: PubInformation;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface PubInput {
  name: string;
  address: string;
  location: MapLocation;
  rules: Rules;
  tables?: Table[];
  createdBy: string;
  isRequiresManualReview: boolean;
  pubInformation?: PubInformationInput;
}

export interface PubInformationInput {
  numberOfTables?: number | null;
  tableQuality?: string | null;
  tableCost?: number | null;
  cueQuality?: string | null;
  hasChalk?: string | null;
  wheelchairAccess?: string | null;
  kidsFriendly?: string | null;
}

export interface CommentInput {
  text: string;
  author: string;
  pubId: number;
}

export interface UserInput {
  name: string;
  email: string;
}
