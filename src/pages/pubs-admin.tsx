import React from "react";
import styled from "styled-components";
import { Pub } from "@/types";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PUBS } from "@/graphql/queries";
import { APPROVE_PUB_MUTATION, DELETE_PUB_MUTATION } from "@/graphql/mutations";
import Spinner from "@/components/Spinner";

const Pubs: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<{ pubs: Pub[] }>(GET_PUBS);

  const [deletePub] = useMutation(DELETE_PUB_MUTATION);
  const [approvePub] = useMutation(APPROVE_PUB_MUTATION);

  const reviewRequiredPubs = data?.pubs.filter(
    (pub) => pub.isRequiresManualReview
  );
  const approvedPubs = data?.pubs.filter((pub) => !pub.isRequiresManualReview);

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
      refetch();
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
      refetch();
    } catch (error) {
      console.error("Error approving pub:", error);
    }
  };

  if (loading)
    return (
      <SpinnerContainer>
        <Spinner size="lg" />
      </SpinnerContainer>
    );

  if (error) return <div>Error: {error.message}</div>;

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
    </Container>
  );
};

export default Pubs;

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
