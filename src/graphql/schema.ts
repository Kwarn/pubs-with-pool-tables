export const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type MapLocation { 
    id: ID!
    lat: Float!
    lng: Float!
  }

  type Rules {
    isCueDeposit: Boolean
    isJumpingAllowed: Boolean
    isPoundOnTable: Boolean
    isReservationAllowed: Boolean
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
    area: String!
    description: String!
    availablity: Int
    location: MapLocation
    rules: Rules
    tables: [Table]
  }

  type Query {
    users: [User]
    pubs: [Pub]
  }
`;
