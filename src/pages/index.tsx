import FindPubMap, { Place } from "@/components/FindPubMap";
import PubDetails from "@/components/PubDetails";
import Spinner from "@/components/Spinner";
import { GET_PUBS } from "@/graphql/queries";
import { Pub } from "@/types";
import { useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const Home = () => {
  const { data, loading, error, refetch } = useQuery<{ pubs: Pub[] }>(GET_PUBS);
  const [place, setPlace] = useState<Place | null>(null);
  const [selectedPub, setSelectedPub] = useState<Pub | null>(null);

  useEffect(() => {
    refetch();
  }, []);

  const pubs = useMemo(
    () =>
      data?.pubs?.map((pub) => ({
        name: pub.name,
        lat: pub.location.lat,
        lng: pub.location.lng,
        type: "pub",
        address: pub.address,
      })) ?? [],
    [data?.pubs]
  );

  useEffect(() => {
    data?.pubs.find((pub) => {
      if (pub.name === place?.name) {
        setSelectedPub(pub);
      }
    });
  }, [place]);

  if (loading)
    return (
      <SpinnerContainer>
        <Spinner size="lg" />
      </SpinnerContainer>
    );

  return (
    <Container>
      {pubs && <FindPubMap setPlace={setPlace} pubs={pubs} />}
      <PubDetailsContainer isVisible={selectedPub !== null}>
        {selectedPub && <PubDetails pub={selectedPub} />}
      </PubDetailsContainer>
    </Container>
  );
};

export default Home;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

interface PubDetailsProps {
  isVisible: boolean;
}

const PubDetailsContainer = styled.div<PubDetailsProps>`
  position: fixed;
  bottom: ${(props) => (props.isVisible ? "0" : "-100%")};
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: bottom 0.5s ease;
  z-index: 1000;
`;
