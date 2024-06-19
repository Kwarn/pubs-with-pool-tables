import { gql } from "@apollo/client";

export const ADD_PUB = gql`
  mutation AddPub($input: PubInput!) {
    addPub(input: $input) {
      id
      name
      area
      description
      availability
      location {
        id
        lat
        lng
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
