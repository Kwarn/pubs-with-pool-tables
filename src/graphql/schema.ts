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
  pubs: [Pub]
  comments(pubId: ID!): [Comment]
  users: [User]
  admin: [Admin]
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
