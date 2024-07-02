import { gql } from "@apollo/client";

export const CREATE_PUB_MUTATION = gql`
  mutation AddPub($input: PubInput!) {
    addPub(input: $input) {
      id
      name
      address
      tables {
        size
        quality
        cost
        description
      }
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
      isRequiresManualReview
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation AddComment($input: CommentInput!) {
    addComment(input: $input) {
      id
      text
      author
      pub {
        id
        name
      }
    }
  }
`;

export const DELETE_PUB_MUTATION = gql`
  mutation DeletePub($id: ID!) {
    deletePub(id: $id) {
      id
    }
  }
`;

export const APPROVE_PUB_MUTATION = gql`
  mutation ApprovePub($id: Int!) {
    approvePub(id: $id) {
      id
      name
      address
      tables {
        size
        quality
        cost
        description
      }
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
      isRequiresManualReview
    }
  }
`;
