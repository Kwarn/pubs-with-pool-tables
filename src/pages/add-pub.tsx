import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddPubMap, { Place } from "@/components/AddPub/AddPubMap";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CREATE_PUB_MUTATION } from "@/graphql/mutations";
import { useRouter } from "next/router";
import AddPubForm from "@/components/AddPub/AddPubForm";
import { PubInput } from "@/types";
import { GET_PUB } from "@/graphql/queries";

const AddPub: React.FC = () => {
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [isNotPub, setIsNotPub] = useState<boolean>(false);
  const [pubAlreadyExists, setPubAlreadyExists] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [getPubData, { data: pubData, loading: pubLoading, error: pubError }] =
    useLazyQuery(GET_PUB);

  useEffect(() => {
    const fetchData = async () => {
      if (place?.address) {
        const { data } = await getPubData({
          variables: { pubAddress: place.address },
        });
        if (data && data.pub) {
          setPubAlreadyExists(true);
          setShowForm(false);
          return
        } else {
          setPubAlreadyExists(false);
          setShowForm(true);
          return
        }
      }
      setPubAlreadyExists(false);
      setShowForm(false);
    };

    fetchData();
  }, [place]);
  const [createPub, { loading, error, data }] =
    useMutation(CREATE_PUB_MUTATION);

  const handleFormSubmit = async (formData: PubInput) => {
    try {
      await createPub({ variables: { input: formData } });
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (data) {
      router.push("/");
    }
  }, [data]);

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
      {showForm && (
        <AddPubFormContainer $isOpen={showForm}>
          <AddPubForm
            place={place}
            isNotPub={isNotPub}
            loading={loading}
            error={error}
            onSubmit={handleFormSubmit}
          />
        </AddPubFormContainer>
      )}
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
  width: 90vw;
  top: 25vh;
  left: calc(50% - 45vw);
  color: ${({ theme }) => theme.colors.text};
  padding: 20px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;
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
