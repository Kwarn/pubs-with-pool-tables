import React from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ADMINS, GET_PUBS, GET_USERS } from "@/graphql/queries";
import {
  APPROVE_PUB_MUTATION,
  DELETE_PUB_MUTATION,
  ADD_ADMIN_MUTATION,
  REMOVE_ADMIN_MUTATION,
} from "@/graphql/mutations";
import Spinner from "@/components/Spinner";
import { Pub, User } from "@/types";
import { Admin } from "@prisma/client";
import RequireAdmin from "@/utils/RequireAdmin";

const AdminPage: React.FC = () => {
  const {
    data: adminData,
    loading: adminLoading,
    error: adminError,
    refetch: refetchAdmins,
  } = useQuery<{ admins: Admin[] }>(GET_ADMINS);

  const {
    data: pubData,
    loading: pubLoading,
    error: pubError,
    refetch: refetchPubs,
  } = useQuery<{ pubs: Pub[] }>(GET_PUBS);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    refetch: refetchUsers,
  } = useQuery<{ users: User[] }>(GET_USERS);

  const [deletePub] = useMutation(DELETE_PUB_MUTATION);
  const [approvePub] = useMutation(APPROVE_PUB_MUTATION);
  const [addAdmin] = useMutation(ADD_ADMIN_MUTATION);
  const [removeAdmin] = useMutation(REMOVE_ADMIN_MUTATION);

  const reviewRequiredPubs = pubData?.pubs.filter(
    (pub) => pub.isRequiresManualReview
  );
  const approvedPubs = pubData?.pubs.filter(
    (pub) => !pub.isRequiresManualReview
  );

  const handleDelete = async (id: number) => {
    try {
      await deletePub({
        variables: { id },
        update(cache) {
          cache.modify({
            fields: {
              pubs(existingPubs = [], { readField }) {
                return existingPubs.filter(
                  (pubRef: any) => id !== readField("id", pubRef)
                );
              },
            },
          });
        },
      });
      refetchPubs();
    } catch (error) {
      console.error("Error deleting pub:", error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approvePub({
        variables: { id: Number(id) },
        update(cache) {
          cache.modify({
            fields: {
              pubs(existingPubs = [], { readField }) {
                return existingPubs.map((pubRef: any) => {
                  if (id === readField("id", pubRef)) {
                    return {
                      ...pubRef,
                      isRequiresManualReview: false,
                    };
                  }
                  return pubRef;
                });
              },
            },
          });
        },
      });
      refetchPubs();
    } catch (error) {
      console.error("Error approving pub:", error);
    }
  };

  const handleAddAdmin = async (userId: number) => {
    try {
      await addAdmin({
        variables: { userId },
      });
      refetchAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const handleRemoveAdmin = async (userId: number) => {
    try {
      await removeAdmin({
        variables: { userId },
      });
      refetchAdmins();
    } catch (error) {
      console.error("Error removing admin:", error);
    }
  };

  if (pubLoading || userLoading || adminLoading)
    return (
      <SpinnerContainer>
        <Spinner size="lg" />
      </SpinnerContainer>
    );

  if (pubError) return <div>Error: {pubError.message}</div>;
  if (userError) return <div>Error: {userError.message}</div>;

  return (
    <Container>
      {reviewRequiredPubs && reviewRequiredPubs.length > 0 && (
        <>
          <TableTitle>REVIEW REQUIRED</TableTitle>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: "20%" }}>Name</Th>
                <Th style={{ width: "10%" }}>Address</Th>
                <Th style={{ width: "10%" }}>Cue Deposit</Th>
                <Th style={{ width: "10%" }}>Jumping Allowed</Th>
                <Th style={{ width: "10%" }}>Pound On Table</Th>
                <Th style={{ width: "10%" }}>Reservation Allowed</Th>
                <Th style={{ width: "20%" }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {reviewRequiredPubs.map((pub) => (
                <tr key={pub.id}>
                  <Td>{pub.name}</Td>
                  <Td>{pub.address}</Td>
                  <Td>{pub.rules.isCueDeposit}</Td>
                  <Td>{pub.rules.isJumpingAllowed}</Td>
                  <Td>{pub.rules.isPoundOnTable}</Td>
                  <Td>{pub.rules.isReservationAllowed}</Td>
                  <ActionTd>
                    <Button onClick={() => handleDelete(pub.id)}>Delete</Button>
                    <Button onClick={() => handleApprove(pub.id)}>
                      Approve
                    </Button>
                  </ActionTd>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {approvedPubs && approvedPubs.length > 0 && (
        <>
          <TableTitle>APPROVED</TableTitle>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: "20%" }}>Name</Th>
                <Th style={{ width: "10%" }}>Address</Th>
                <Th style={{ width: "10%" }}>Cue Deposit</Th>
                <Th style={{ width: "10%" }}>Jumping Allowed</Th>
                <Th style={{ width: "10%" }}>Pound On Table</Th>
                <Th style={{ width: "10%" }}>Reservation Allowed</Th>
                <Th style={{ width: "20%" }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {approvedPubs?.map((pub) => (
                <tr key={pub.id}>
                  <Td>{pub.name}</Td>
                  <Td>{pub.address}</Td>
                  <Td>{pub.rules.isCueDeposit}</Td>
                  <Td>{pub.rules.isJumpingAllowed}</Td>
                  <Td>{pub.rules.isPoundOnTable}</Td>
                  <Td>{pub.rules.isReservationAllowed}</Td>
                  <ActionTd>
                    <Button onClick={() => handleDelete(pub.id)}>Delete</Button>
                  </ActionTd>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <TableTitle>USERS</TableTitle>
      <UserList>
        {userData?.users?.map((user) => {
          const isAdmin = adminData?.admins.some(
            (admin) => admin.userId === user.id
          );

          return (
            <UserItem key={user.id}>
              <UserInfo>Name: {user.name}</UserInfo>
              <UserInfo>Email: {user.email}</UserInfo>
              <div>
                {isAdmin ? (
                  <Button onClick={() => handleRemoveAdmin(user.id)}>
                    Remove Admin
                  </Button>
                ) : (
                  <Button onClick={() => handleAddAdmin(user.id)}>
                    Add Admin
                  </Button>
                )}
              </div>
            </UserItem>
          );
        })}
      </UserList>
    </Container>
  );
};

export default RequireAdmin(AdminPage);

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  background-color: #4a4848;
  color: ${({ theme }) => theme.colors.text};
`;

const TableTitle = styled.h2`
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px dotted #798dcf;
  padding: 8px;
  text-align: center;
  max-height: 40px;
  background-color: #798dcf;
`;

const Td = styled.td`
  border: 1px dotted #798dcf;
  padding: 8px;
  text-align: center;
  max-height: 40px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const ActionTd = styled.td`
  border: 1px dotted #798dcf;
  padding: 8px;
  text-align: center;
  max-height: 40px;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #798dcf;
  color: ${({ theme }) => theme.colors.text};
  border: none;
  cursor: pointer;
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserItem = styled.li`
  background-color: #626060;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
`;

const UserInfo = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;
