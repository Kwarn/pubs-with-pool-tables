export const typeDefs = `
type MapLocation {
  id: ID!
  lat: Float!
  lng: Float!
}

type Rules {
  isCueDeposit: String!
  isJumpingAllowed: String!
  isPoundOnTable: String!
  isReservationAllowed: String!
}

type Table {
  size: String
  quality: String
  cost: Float
  description: String
}

type Comment {
  id: ID!
  text: String!
  author: String!
  createdAt: String!
  pub: Pub!
}

type PubInformation {
  id: ID!
  numberOfTables: Int
  tableQuality: String
  tableCost: Float
  cueQuality: String
  hasChalk: String
  wheelchairAccess: String
  kidsFriendly: String
}

type Pub {
  id: ID!
  name: String!
  address: String!
  location: MapLocation!
  rules: Rules!
  tables: [Table]
  comments: [Comment]
  createdBy: String!
  updatedBy: [String]
  isRequiresManualReview: Boolean!
  pubInformation: PubInformation
}

type User {
  id: Int!
  name: String!
  email: String!
}

input PubInput {
  name: String!
  address: String!
  location: MapLocationInput
  rules: RulesInput
  tables: [TableInput]
  createdBy: String!
  isRequiresManualReview: Boolean!
  pubInformation: PubInformationInput
}

input PubInformationInput {
  numberOfTables: Int
  tableQuality: String
  tableCost: Float
  cueQuality: String
  hasChalk: String
  wheelchairAccess: String
  kidsFriendly: String
}

input MapLocationInput {
  lat: Float!
  lng: Float!
}

input RulesInput {
  isCueDeposit: String!
  isJumpingAllowed: String!
  isPoundOnTable: String!
  isReservationAllowed: String!
}

input TableInput {
  size: String
  quality: String
  cost: Float
  description: String
}

input CommentInput {
  text: String!
  author: String!
  pubId: ID!
}

input UserInput {
  name: String!
  email: String!
}

type Admin {
  id: Int!
  userId: Int!
}

type Query {
  pub(pubAddress: String!): Pub
  pubs: [Pub]
  comments(pubId: ID!): [Comment]
  users: [User]
  admin(userId: ID!): Admin
  admins: [Admin]
}

type Mutation {
  addPub(input: PubInput!): Pub!
  addComment(input: CommentInput!): Comment!
  deletePub(id: ID!): Pub!
  approvePub(id: Int!): Pub!
  addUser(input: UserInput!): User!
  addAdmin(userId: Int!): Admin!
  removeAdmin(userId: Int!): Admin!
}
`;
