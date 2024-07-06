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
  createdBy: string;
  isRequiresManualReview: boolean;
  pubInformation: PubInformationInput;
}

export interface UpdatePubInput {
  pubId: number;
  rules: Rules;
  updatedBy: string;
  // TODO in order to do this we need to add updates to a UpdatesPending table so we can retain the original until the update is approved and replaces it
  // for now we'll just update the pub directly passing 'false' for isRequiresManualReview
  isRequiresManualReview: boolean; 
  pubInformation: PubInformationInput;
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
