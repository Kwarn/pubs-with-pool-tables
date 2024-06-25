import FindPubMap, { Place } from "@/components/FindPubMap";
import PubDetails from "@/components/PubDetails";
import Spinner from "@/components/Spinner";
import { GET_PUBS } from "@/graphql/queries";
import { Pub } from "@/types";
import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const Home = () => {
  const { data, loading, error, refetch } = useQuery<{ pubs: Pub[] }>(GET_PUBS);
  const [place, setPlace] = React.useState<Place | null>(null);
  const [selectedPub, setSelectedPub] = React.useState<Pub | null>(null);

  const pubs = data?.pubs.map((pub) => ({
    name: pub.name,
    lat: pub.location.lat,
    lng: pub.location.lng,
    type: "pub",
    address: pub.address,
  }));

  useEffect(() => {
    data?.pubs.find((pub) => {
      if (pub.name === place?.name) {
        setSelectedPub(pub);
      }
    });
  }, [place]);

  if (loading)
    return (
      <Container>
        <Spinner size="lg" />
      </Container>
    );

  return (
    <>
      {pubs && <FindPubMap setPlace={setPlace} pubs={pubs} />}
      {selectedPub && <PubDetails pub={selectedPub} />}
    </>
  );
};

export default Home;
