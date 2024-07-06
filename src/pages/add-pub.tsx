import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddPubMap, { Place } from "@/components/AddPub/AddPubMap";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_PUB_MUTATION, UPDATE_PUB_MUTATION } from "@/graphql/mutations";
import { useRouter } from "next/router";
import AddPubForm from "@/components/AddPub/AddPubForm";
import { Pub, PubInput, UpdatePubInput } from "@/types";
import { GET_PUB } from "@/graphql/queries";

const AddPub: React.FC = () => {
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [pubAlreadyExists, setPubAlreadyExists] = useState<boolean>(false);

  const [getPubData, { loading: pubLoading, error: pubError }] =
    useLazyQuery(GET_PUB);

  useEffect(() => {
    if (!place) {
      setPubAlreadyExists(false);
      setShowForm(false);
      return;
    }

    const fetchData = async () => {
      const { data } = await getPubData({
        variables: { pubAddress: place.address },
      });
      if (data?.pub) {
        setPubAlreadyExists(true);
        return setShowForm(false);
      }
      setPubAlreadyExists(false);
      setShowForm(true);
    };

    if (place.address) fetchData();
  }, [place]);

  const onSubmitCallback = (createdPub: Pub) => {
    console.log("createdPub", createdPub);
    if (createdPub) {
      router.push("/");
    }
  };

  return (
    <Container>
      <MapContainer $isFullScreen={!place || !showForm}>
        <AddPubMap setPlace={setPlace} showSearch={!place || !showForm} />
      </MapContainer>
      {pubAlreadyExists && (
        <PubAlreadyExists>
          <h3>This pub has already been added</h3>
        </PubAlreadyExists>
      )}

      <AddPubFormContainer $isOpen={showForm}>
        <AddPubForm place={place} onSubmitCallback={onSubmitCallback} />
      </AddPubFormContainer>
    </Container>
  );
};

export default AddPub;

const Container = styled.div`
  width: 100%;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: calc(100vh - 72px); // account for navbar height
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PubAlreadyExists = styled.div`
  position: absolute;
  width: 20vw;
  top: 25vh;
  left: calc(50% - 10vw);
  color: ${({ theme }) => theme.colors.text};
  padding: 20px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;
  h3 {
    text-align: center;
  }
  @media (max-width: 768px) {
    width: 90vw;
    top: 25vh;
    left: calc(50% - 45vw);
  }
`;

const AddPubFormContainer = styled.div<{ $isOpen: boolean }>`
  background-color: ${({ theme }) => theme.colors.primary};
  width: ${({ $isOpen }) => ($isOpen ? "40vw" : "0")};
  transition: width 0.3s ease-in-out;
  height: 100%;
  overflow-y: auto;
  @media (max-width: 768px) {
    width: 100%;
    height: ${({ $isOpen }) => ($isOpen ? "100%" : "0")};
    transition: height 0.3s ease-in-out;
  }
`;

const MapContainer = styled.div<{ $isFullScreen?: boolean }>`
  width: 100%;
  height: 100%;
  @media (max-width: 768px) {
    height: ${({ $isFullScreen }) => ($isFullScreen ? "100%" : "30vh")};
    transition: height 0.3s ease-in-out;
  }
`;
