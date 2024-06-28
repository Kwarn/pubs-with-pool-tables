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
