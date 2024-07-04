import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddPubMap, { Place } from "@/components/AddPub/AddPubMap";
import { useMutation } from "@apollo/client";
import { CREATE_PUB_MUTATION } from "@/graphql/mutations";
import { useRouter } from "next/router";
import AddPubForm from "@/components/AddPub/AddPubForm";
import { PubInput } from "@/types";

const AddPub: React.FC = () => {
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [isNotPub, setIsNotPub] = useState<boolean>(false);

  useEffect(() => {
    if (place?.type !== "bar") setIsNotPub(true);
    else setIsNotPub(false);
  }, [place]);

  const [createPub, { loading, error, data }] =
    useMutation(CREATE_PUB_MUTATION);

  const handleFormSubmit = async (formData: PubInput) => {
    try {
      await createPub({ variables: { input: formData } });
      await fetch("/api/revalidate-find-pub", {
        method: "POST",
      });
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
      <MapContainer $isFullScreen={!place}>
        <AddPubMap setPlace={setPlace} place={place} />
      </MapContainer>
      <AddPubFormContainer $isOpen={!!place}>
        <AddPubForm
          place={place}
          isNotPub={isNotPub}
          loading={loading}
          error={error}
          onSubmit={handleFormSubmit}
        />
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

const AddPubFormContainer = styled.div<{ $isOpen: boolean }>`
  background-color: #294b2b;
  width: ${({ $isOpen }) => ($isOpen ? "30vw" : "0")};
  transition: width 0.3s ease-in-out;
  height: 100%;
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
