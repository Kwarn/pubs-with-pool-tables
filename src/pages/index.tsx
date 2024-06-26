import FindPubMap, { Place } from "@/components/FindPubMap";
import PubDetails from "@/components/PubDetails/PubDetails";
import Spinner from "@/components/Spinner";
import { CREATE_COMMENT_MUTATION } from "@/graphql/mutations";
import { GET_PUBS } from "@/graphql/queries";
import { CommentInput, Pub } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const Home = () => {
  const { data, loading, error, refetch } = useQuery<{ pubs: Pub[] }>(GET_PUBS);
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

  useEffect(() => {
    refetch();
  }, []);

  // Map the data to the format required by the FindPubMap component
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
    // when a place on the map is clicked this finds and sets the selectedPub for use in PubDetails
    const matchingPub = data?.pubs.find((pub) => pub.name === place?.name);
    if (matchingPub) {
      setSelectedPub(matchingPub);
    } else {
      setSelectedPub(null);
    }
  }, [place]);

  if (loading)
    return (
      <SpinnerContainer>
        <Spinner size="lg" />
      </SpinnerContainer>
    );

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
  $isVisible: boolean;
}

const PubDetailsContainer = styled.div<PubDetailsProps>`
  position: fixed;
  bottom: ${(props) => (props.$isVisible ? "0" : "-100%")};
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: bottom 0.5s ease;
  z-index: 1000;
  height: 400px;
  max-height: 400px;
`;
