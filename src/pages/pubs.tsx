import { gql, useQuery } from "@apollo/client";
import { Pub } from "@prisma/client";
import React from "react";

const GET_PUBS = gql`
  query GetPubs {
    pubs {
      area
      availablity
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
      id
      name
      rules {
        isCueDeposit
        isJumpingAllowed
        isPoundOnTable
        isReservationAllowed
      }
    }
  }
`;

const Pubs: React.FC = () => {
  const { data, loading, error } = useQuery<{ pubs: Pub[] }>(GET_PUBS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <div>
      {data?.pubs.map((pub) => (
        <div key={pub.id}>
          <h2>{pub.name}</h2>
          <p>Area: {pub.area}</p>
          <p>Description: {pub.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Pubs;
