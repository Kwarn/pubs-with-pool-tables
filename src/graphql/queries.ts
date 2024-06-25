import { gql } from '@apollo/client';

export const GET_PUBS = gql`
  query GetPubs {
    pubs {
      id
      name
      address
      createdBy
      description
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
