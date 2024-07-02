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

type Query {
  pubs: [Pub]
  comments(pubId: ID!): [Comment]
}

type Mutation {
  addPub(input: PubInput!): Pub!
  addComment(input: CommentInput!): Comment!
  deletePub(id: ID!): Pub!
  approvePub(id: Int!): Pub!
}

`;
