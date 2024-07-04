import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Spinner from "@/components/Spinner";
import { Place } from "./AddPubMap";
import { PubInput } from "@/types";
import { useUserStore } from "@/state/userStore";

interface AddPubFormProps {
  place: Place | null;
  isNotPub: boolean;
  loading: boolean;
  error: any;
  onSubmit: (input: PubInput) => void;
}

const AddPubForm: React.FC<AddPubFormProps> = ({
  place,
  isNotPub,
  loading,
  error,
  onSubmit,
}) => {
  const { user } = useUserStore();

  const [formState, setFormState] = useState({
    name: "",
    address: "",
    isCueDeposit: "Don't Know",
    isJumpingAllowed: "Don't Know",
    isPoundOnTable: "Don't Know",
    isReservationAllowed: "Don't Know",
  });

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      name: place?.name ?? "",
      address: place?.address ?? "",
    }));
  }, [place]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleButtonToggle = (name: keyof typeof formState, value: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.name) {
      return; // TODO: need auth redirect
    }

    onSubmit({
      name: formState.name,
      address: formState.address,
      location: {
        lat: place?.lat ?? 0,
        lng: place?.lng ?? 0,
      },
      rules: {
        isCueDeposit: formState.isCueDeposit,
        isJumpingAllowed: formState.isJumpingAllowed,
        isPoundOnTable: formState.isPoundOnTable,
        isReservationAllowed: formState.isReservationAllowed,
      },
      isRequiresManualReview: isNotPub,
      createdBy: user.name,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert $bgColor="#f8d7da">
          <p>{error?.message || "Something went wrong.."}</p>
        </Alert>
      )}
      {!place && (
        <Alert $bgColor="transparent">
          <p>Search for a pub or select a pub on the map to start</p>
        </Alert>
      )}

      {place && (
        <PlaceContainer>
          <FormGroup>
            <PlaceTitle>{formState.name}</PlaceTitle>
          </FormGroup>
          <FormGroup>
            <PlaceAddress>{formState.address}</PlaceAddress>
          </FormGroup>
        </PlaceContainer>
      )}
      {place && isNotPub && (
        <Alert $bgColor="#f3cca8">
          <p>
            Are you sure this is a pub?
            <br /> Google thinks {"it's"} a {place?.type}.
            <br /> You can still add this venue but it will have to be manually
            reviewed before others can see it.
          </p>
        </Alert>
      )}

      <FormGroup>
        <Label>is a deposit for the cues required?</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "Yes")}
            $selected={formState.isCueDeposit === "Yes"}
            disabled={loading || !place}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "No")}
            $selected={formState.isCueDeposit === "No"}
            disabled={loading || !place}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "Don't Know")}
            $selected={formState.isCueDeposit === "Don't Know"}
            disabled={loading || !place}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>is jumping the whiteball allowed?</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "Yes")}
            $selected={formState.isJumpingAllowed === "Yes"}
            disabled={loading || !place}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "No")}
            $selected={formState.isJumpingAllowed === "No"}
            disabled={loading || !place}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "Don't Know")}
            $selected={formState.isJumpingAllowed === "Don't Know"}
            disabled={loading || !place}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>Can you hold a place in queue with a coin?</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "Yes")}
            $selected={formState.isPoundOnTable === "Yes"}
            disabled={loading || !place}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "No")}
            $selected={formState.isPoundOnTable === "No"}
            disabled={loading || !place}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "Don't Know")}
            $selected={formState.isPoundOnTable === "Don't Know"}
            disabled={loading || !place}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>Can the tables here be pre-booked?</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isReservationAllowed", "Yes")}
            $selected={formState.isReservationAllowed === "Yes"}
            disabled={loading || !place}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isReservationAllowed", "No")}
            $selected={formState.isReservationAllowed === "No"}
            disabled={loading || !place}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() =>
              handleButtonToggle("isReservationAllowed", "Don't Know")
            }
            $selected={formState.isReservationAllowed === "Don't Know"}
            disabled={loading || !place}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <SubmitButton type="submit" disabled={loading || !place}>
        {loading ? <Spinner size="sm" /> : "Add Pub"}
      </SubmitButton>
    </Form>
  );
};

export default AddPubForm;

const Form = styled.form`
  width: 30vw;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
    transition: height 0.3s ease;
    padding: 0;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 10px;
`;

const Label = styled.label`
  color: white;
  margin: 10px 0 5px 0;
  font-size: 20px;
  @media (max-width: 768px) {
    margin: 5px 0;
  }
`;

const PlaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-radius: 4px;
  color: white;
`;

const PlaceTitle = styled.h2`
  font-family: "Neat Chalk", sans-serif;
  font-size: 16px;
  margin: 20px 0 0 0;
  text-align: center;
`;

const PlaceAddress = styled.p`
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  justify-content: space-between;
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const Button = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 10px 15px;
  background-color: ${(props) => (props.$selected ? "#25913e" : "#EEE")};
  color: ${(props) => (props.$selected ? "#FFF" : "#333")};
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:not(:last-child) {
    margin-right: 10px;
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$selected ? "#25913e" : "#DDD")};
  }
  @media (max-width: 768px) {
    padding: 5px 10px;
  }
`;

const SubmitButton = styled.button`
  margin: 15px 10px 0px 10px;
  padding: 10px 15px;
  background-color: #2e92ea;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

interface AlertProps {
  $bgColor: string;
}

const Alert = styled.div<AlertProps>`
  text-align: center;
  display: flex;
  background-color: ${(props) => props.$bgColor};
  height: fit-content;
  width: calc(100% - 20px);
  margin: 0 10px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  p {
    font-size: 18px;
    margin: 5px;
    align-self: center;
  }
`;
