import { GetServerSideProps } from "next";
import FindPubMap, { Place } from "@/components/FindPub/FindPubMap";
import PubDetails from "@/components/FindPub/PubDetails";
import { CREATE_COMMENT_MUTATION } from "@/graphql/mutations";
import { CommentInput, Pub } from "@/types";
import { useMutation } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import prisma from "@/lib/prisma";

const fetchPubs = async () => {
  const pubsData = await prisma.pub.findMany({
    include: {
      location: true,
      rules: true,
      pubInformation: true,
    },
  });

  const approvedPubs = pubsData.filter((pub) => !pub.isRequiresManualReview);
  return approvedPubs;
};

const Home = ({ pubsData }: { pubsData: Pub[] }) => {
  const [place, setPlace] = useState<Place | null>(null);
  const [selectedPub, setSelectedPub] = useState<Pub | null>(null);

  const [
    createComment,
    { loading: commentLoading, error: commentError, data: commentData },
  ] = useMutation(CREATE_COMMENT_MUTATION);

  const handleCommentSubmit = async (input: CommentInput) => {
    try {
      await createComment({ variables: { input } });
    } catch (e: any) {
      console.log(e);
    }
  };

  // Map the data to the format required by the FindPubMap component
  const pubs = useMemo(
    () =>
      pubsData?.map((pub) => ({
        name: pub.name,
        lat: pub.location.lat,
        lng: pub.location.lng,
        type: "pub",
        address: pub.address,
      })) ?? [],
    [pubsData]
  );

  useEffect(() => {
    // when a place on the map is clicked this finds and sets the selectedPub for use in PubDetails
    const matchingPub = pubsData.find((pub) => pub.name === place?.name);
    if (matchingPub) {
      setSelectedPub(matchingPub);
    } else {
      setSelectedPub(null);
    }
  }, [place, pubsData]);

  return (
    <Container>
      {pubs && (
        <MapContainer $isFullScreen={!place}>
          <FindPubMap
            setPlace={setPlace}
            pubs={pubs}
            isMinimized={selectedPub !== null}
          />
        </MapContainer>
      )}
      <PubDetailsContainer $isVisible={selectedPub !== null}>
        {selectedPub && (
          <PubDetails
            pub={selectedPub}
            onAddComment={handleCommentSubmit}
            newComment={commentData?.addComment || null}
          />
        )}
      </PubDetailsContainer>
    </Container>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const pubs = await fetchPubs();

  return {
    props: {
      pubsData: pubs,
    },
  };
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 80px);
`;

const MapContainer = styled.div<{ $isFullScreen: boolean }>`
  width: 100%;
  height: calc(100vh - 80px);
  @media (max-width: 768px) {
    height: ${(props) => (props.$isFullScreen ? `calc(100vh - 80px)` : "30vh")};
  }
`;

const PubDetailsContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  bottom: ${(props) => (props.$isVisible ? "0" : "-100%")};
  left: 0;
  right: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: bottom 0.3s ease-in-out;
  z-index: 1000;
  height: 30vh;

  @media (max-width: 768px) {
    height: 70%;
  }
`;
