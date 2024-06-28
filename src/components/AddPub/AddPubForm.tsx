import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Spinner from "@/components/Spinner";
import { Place } from "./AddPubMap";

interface AddPubFormProps {
  place: Place | null;
  isNotPub: boolean;
  isOpen: boolean;
  loading: boolean;
  error: any;
  onSubmit: (input: any) => void;
}

const AddPubForm: React.FC<AddPubFormProps> = ({
  isOpen,
  place,
  isNotPub,
  loading,
  error,
  onSubmit,
}) => {
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    isCueDeposit: "Don't Know",
    isJumpingAllowed: "Don't Know",
    isPoundOnTable: "Don't Know",
    isReservationAllowed: "Don't Know",
  });

  const [noSelectedPubError, setNoSelectedPubError] = useState<boolean>(false);

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
    if (!place) {
      setNoSelectedPubError(true);
      return;
    }
    if (!formState.name || !formState.address) return;

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
    });
  };

  return (
    <Form onSubmit={handleSubmit} $isOpen={isOpen}>
      {error && (
        <Alert bgColor="#f8d7da">
          <p>{error?.message || "Something went wrong.."}</p>
        </Alert>
      )}
      {!place && !noSelectedPubError && (
        <Alert bgColor="#a3eeaf">
          <p>Search for a pub or select a pub on the map to start</p>
        </Alert>
      )}
      {place && isNotPub && (
        <Alert bgColor="#f3cca8">
          <p>
            Are you sure this is a pub? Google considers it a {place?.type}. You
            can still add this venue but it will have to be manually reviewed
            before others can see it.
          </p>
        </Alert>
      )}

      {noSelectedPubError && (
        <Alert bgColor="#f8d7da">
          <p>Please select a pub on the map</p>
        </Alert>
      )}
      <FormGroup>
        <Label>Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
          readOnly
          hasValue={formState.name.length > 0}
        />
      </FormGroup>
      <FormGroup>
        <Label>Address</Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={formState.address}
          onChange={handleChange}
          required
          readOnly
          hasValue={formState.address.length > 0}
        />
      </FormGroup>

      <FormGroup>
        <Label>Cue Deposit Required</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "Yes")}
            selected={formState.isCueDeposit === "Yes"}
            disabled={loading}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "No")}
            selected={formState.isCueDeposit === "No"}
            disabled={loading}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "Don't Know")}
            selected={formState.isCueDeposit === "Don't Know"}
            disabled={loading}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>Jumping Whiteball Allowed</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "Yes")}
            selected={formState.isJumpingAllowed === "Yes"}
            disabled={loading}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "No")}
            selected={formState.isJumpingAllowed === "No"}
            disabled={loading}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "Don't Know")}
            selected={formState.isJumpingAllowed === "Don't Know"}
            disabled={loading}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>Coin On Table Reservation Allowed</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "Yes")}
            selected={formState.isPoundOnTable === "Yes"}
            disabled={loading}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "No")}
            selected={formState.isPoundOnTable === "No"}
            disabled={loading}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "Don't Know")}
            selected={formState.isPoundOnTable === "Don't Know"}
            disabled={loading}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>Pre-booking Table Allowed</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isReservationAllowed", "Yes")}
            selected={formState.isReservationAllowed === "Yes"}
            disabled={loading}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isReservationAllowed", "No")}
            selected={formState.isReservationAllowed === "No"}
            disabled={loading}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() =>
              handleButtonToggle("isReservationAllowed", "Don't Know")
            }
            selected={formState.isReservationAllowed === "Don't Know"}
            disabled={loading}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Add Pub"}
      </SubmitButton>
    </Form>
  );
};

export default AddPubForm;

interface FormProps {
  $isOpen: boolean;
}

const Form = styled.form<FormProps>`
  width: 30vw;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

interface InputProps {
  hasValue: boolean;
}
const Input = styled.input<InputProps>`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  pointer-events: none;
  user-select: none;
  opacity: ${(props) => (props.hasValue ? 0.7 : 0.3)};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  justify-content: space-between;
`;

const Button = styled.button<{ selected: boolean }>`
  width: 100%;
  padding: 10px 15px;
  background-color: ${(props) => (props.selected ? "#25913e" : "#EEE")};
  color: ${(props) => (props.selected ? "#FFF" : "#333")};
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
    background-color: ${(props) => (props.selected ? "#25913e" : "#DDD")};
  }
`;

const SubmitButton = styled.button`
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
  bgColor: string;
}

const Alert = styled.div<AlertProps>`
  display: flex;
  background-color: ${(props) => props.bgColor};
  height: fit-content;
  width: calc(100% - 20px);
  padding: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  border-radius: 4px;
  p {
    font-size: 20px;
    text-align: center;
    margin: auto;
    align-self: center;
  }
`;
