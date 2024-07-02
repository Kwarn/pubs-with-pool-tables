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
      <MapContainer>
        <AddPubMap setPlace={setPlace} />
      </MapContainer>
      <AddPubForm
        place={place}
        isNotPub={isNotPub}
        loading={loading}
        error={error}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
};

export default AddPub;

const Container = styled.div`
  width: 100%;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: calc(100vh - 80px); // account for navbar height
`;

interface MapContainerProps {
  $isFullScreen?: boolean;
}

const MapContainer = styled.div<MapContainerProps>`
  width: 100%;
  height: 100%;
`;
