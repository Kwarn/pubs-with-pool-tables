import React from "react";
import styled from "styled-components";
import { Pub } from "@/types";

interface PubDetailsProps {
  pub: Pub;
}

const PubDetails: React.FC<PubDetailsProps> = ({ pub }) => {
  return (
    <Container id={pub.name}>
      <Name>{pub?.name ?? "unknown"}</Name>
      <Info>
        <strong>Address:</strong> {pub?.address || "unknown"}
      </Info>
      <Info>
        <strong>Description:</strong> {pub.description}
      </Info>
      <Info>
        <strong>Created By:</strong> {pub.createdBy?.name ?? "Unknown"}
      </Info>
      {/* You can add more details as needed */}
      <Info>
        <strong>Cue Deposit Required</strong> {pub.rules.isCueDeposit}
      </Info>
      <Info>
        <strong>Jumping Whiteball Allowed</strong> {pub.rules.isJumpingAllowed}
      </Info>
      <Info>
        <strong>Coin On Table Reservation Allowed</strong>
        {pub.rules.isPoundOnTable}
      </Info>
      <Info>
        <strong>Pre-booking Table Allowed</strong>
        {pub.rules.isReservationAllowed}
      </Info>
      {/* Display tables if available */}
      {pub.tables && pub.tables.length > 0 && (
        <Info>
          <strong>Tables:</strong>
          <ul>
            {pub.tables.map((table) => (
              <li key={table.id}>
                Size: {table.size}, Quality: {table.quality}, Cost: {table.cost}
              </li>
            ))}
          </ul>
        </Info>
      )}
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const Name = styled.h2`
  margin-bottom: 10px;
`;

const Info = styled.div`
  margin-bottom: 10px;

  strong {
    margin-right: 5px;
  }
`;

export default PubDetails;
