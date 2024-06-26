import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddPubMap, { Place } from "@/components/AddPub/AddPubMap";
import { useMutation } from "@apollo/client";
import { CREATE_PUB_MUTATION } from "@/graphql/mutations";
import { useRouter } from "next/router";
import { useUserStore } from "@/state/userStore";
import AddPubForm from "@/components/AddPub/AddPubForm";
import { PubInput } from "@/types";

const AddPub: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [place, setPlace] = useState<Place | null>(null);
  const [isNotPub, setIsNotPub] = useState<boolean>(false);
  const [noSelectedPubError, setNoSelectedPubError] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    if (place) setIsFormOpen(true);
    if (place?.type !== "bar") setIsNotPub(true);
    else setIsNotPub(false);
  }, [place]);

  const [createPub, { loading, error, data }] =
    useMutation(CREATE_PUB_MUTATION);

  const handleFormSubmit = async (formData: PubInput) => {
    setNoSelectedPubError(false);

    const input = {
      ...formData,
      createdBy: user?.name ?? "",
    };

    try {
      await createPub({ variables: { input } });
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
      <MapContainer $isFullScreen={!isFormOpen}>
        <AddPubMap setPlace={setPlace} />
      </MapContainer>
      <AddPubForm
        place={place}
        isNotPub={isNotPub}
        isOpen={!isFormOpen}
        noSelectedPubError={noSelectedPubError}
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
  margin: 0 auto;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: center;
  transition: width 0.5s ease;
`;

interface MapContainerProps {
  $isFullScreen?: boolean;
}

const MapContainer = styled.div<MapContainerProps>`
  margin-top: 20px;
  width: ${(props) => (props.$isFullScreen ? "100vw" : "70vw")};
  transition: width 0.5s ease;
  height: 100%;
`;
