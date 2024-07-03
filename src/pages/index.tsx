import { GetStaticProps } from "next";
import FindPubMap, { Place } from "@/components/FindPub/FindPubMap";
import PubDetails from "@/components/FindPub/PubDetails";
import { CREATE_COMMENT_MUTATION } from "@/graphql/mutations";
import { GET_PUBS } from "@/graphql/queries";
import { CommentInput, Pub } from "@/types";
import { useMutation } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";

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
        <FindPubMap
          setPlace={setPlace}
          pubs={pubs}
          isMinimized={selectedPub !== null}
        />
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

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: GET_PUBS,
  });

  const approvedPubs = data.pubs.filter(
    (pub: Pub) => !pub.isRequiresManualReview
  );

  return addApolloState(apolloClient, {
    props: {
      pubsData: approvedPubs,
    },
    revalidate: 900, // Revalidate every 15 mins
  });
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 80px);
`;

interface PubDetailsProps {
  $isVisible: boolean;
}

const PubDetailsContainer = styled.div<PubDetailsProps>`
  position: fixed;
  bottom: ${(props) => (props.$isVisible ? "0" : "-100%")};
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: bottom 0.3s ease-in-out;
  z-index: 1000;
  height: 30vh;
  max-height: 30vh;
`;
