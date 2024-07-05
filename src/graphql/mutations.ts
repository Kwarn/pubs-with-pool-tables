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

export const ADD_USER_MUTATION = gql`
  mutation AddUser($input: UserInput!) {
    addUser(input: $input) {
      id
      name
      email
    }
  }
`;

export const ADD_ADMIN_MUTATION = gql`
  mutation AddAdmin($userId: Int!) {
    addAdmin(userId: $userId) {
      userId
    }
  }
`;

export const REMOVE_ADMIN_MUTATION = gql`
  mutation RemoveAdmin($userId: Int!) {
    removeAdmin(userId: $userId) {
      userId
    }
  }
`;
