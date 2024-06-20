import React from "react";
import styled from "styled-components";
import { Pub } from "@/types";
import { gql, useQuery } from "@apollo/client";
import { GET_PUBS } from "@/graphql/queries";

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  background-color: #4a4848;
  color: white;
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

const Pubs: React.FC = () => {
  const { data, loading, error } = useQuery<{ pubs: Pub[] }>(GET_PUBS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <Th style={{ width: "20%" }}>Name</Th>
            <Th style={{ width: "10%" }}>Area</Th>
            <Th style={{ width: "30%" }}>Description</Th>
            <Th style={{ width: "10%" }}>Availability</Th>
            <Th style={{ width: "10%" }}>Cue Deposit</Th>
            <Th style={{ width: "10%" }}>Jumping Allowed</Th>
            <Th style={{ width: "10%" }}>Pound On Table</Th>
            <Th style={{ width: "10%" }}>Reservation Allowed</Th>
          </tr>
        </thead>
        <tbody>
          {data?.pubs.map((pub) => (
            <tr key={pub.id}>
              <Td>{pub.name}</Td>
              <Td>{pub.address}</Td>
              <Td>{pub.description}</Td>
              <Td>{pub.rules.isCueDeposit ? "Yes" : "No"}</Td>
              <Td>{pub.rules.isJumpingAllowed ? "Yes" : "No"}</Td>
              <Td>{pub.rules.isPoundOnTable ? "Yes" : "No"}</Td>
              <Td>{pub.rules.isReservationAllowed ? "Yes" : "No"}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Pubs;
