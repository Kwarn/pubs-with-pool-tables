import { gql } from "@apollo/client";

export const GET_PUBS = gql`
  query GetPubs {
    pubs {
      id
      name
      address
      createdBy
      location {
        id
        lat
        lng
      }
      tables {
        cost
        description
        quality
        size
      }
      rules {
        isCueDeposit
        isJumpingAllowed
        isPoundOnTable
        isReservationAllowed
      }
      pubInformation {
        cueQuality
        hasChalk
        kidsFriendly
        numberOfTables
        tableCost
        tableQuality
        wheelchairAccess
      }
      isRequiresManualReview
    }
  }
`;

export const GET_PUB = gql`
  query GetPub($pubAddress: String!) {
    pub(pubAddress: $pubAddress) {
      id
    }
  }
`;

export const GET_PUB_COMMENTS = gql`
  query GetPubComments($pubId: ID!) {
    comments(pubId: $pubId) {
      id
      text
      author
      createdAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export const GET_ADMINS = gql`
  query GetAdmins {
    admins {
      userId
    }
  }
`;

export const GET_ADMIN = gql`
  query GetAdmin($userId: ID!) {
    admin(userId: $userId) {
      userId
    }
  }
`;
