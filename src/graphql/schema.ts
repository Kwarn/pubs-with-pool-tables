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

  type Pub {
    id: ID!
    name: String!
    address: String!
    description: String
    location: MapLocation!
    rules: Rules!
    tables: [Table]
    createdBy: String!
    updatedBy: [String]
  }

  input PubInput {
    name: String!
    address: String!
    description: String!
    location: MapLocationInput
    rules: RulesInput
    tables: [TableInput]
    createdBy: String!
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

  type Query {
    pubs: [Pub]
  }

  type Mutation {
    addPub(input: PubInput!): Pub
  }
`;
