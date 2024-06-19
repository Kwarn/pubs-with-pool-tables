import { Pub } from "@/types";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import styles from "@/styles/Pubs.module.scss";

const GET_PUBS = gql`
  query GetPubs {
    pubs {
      id
      name
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

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Name</th>
            <th style={{ width: "10%" }}>Area</th>
            <th style={{ width: "30%" }}>Description</th>{" "}
            <th style={{ width: "10%" }}>Availability</th>{" "}
            <th style={{ width: "10%" }}>Cue Deposit</th>{" "}
            <th style={{ width: "10%" }}>Jumping Allowed</th>{" "}
            <th style={{ width: "10%" }}>Pound On Table</th>{" "}
            <th style={{ width: "10%" }}>Reservation Allowed</th>{" "}
          </tr>
        </thead>
        <tbody>
          {data?.pubs.map((pub) => (
            <tr key={pub.id}>
              <td>{pub.name}</td>
              <td>{pub.area}</td>
              <td>{pub.description}</td>
              <td>{pub.availability}</td>
              <td>{pub.rules.isCueDeposit ? "Yes" : "No"}</td>
              <td>{pub.rules.isJumpingAllowed ? "Yes" : "No"}</td>
              <td>{pub.rules.isPoundOnTable ? "Yes" : "No"}</td>
              <td>{pub.rules.isReservationAllowed ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pubs;
