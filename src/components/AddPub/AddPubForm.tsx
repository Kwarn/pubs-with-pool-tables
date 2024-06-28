import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Spinner from "@/components/Spinner";
import { Place } from "./AddPubMap";

interface AddPubFormProps {
  place: Place | null;
  isNotPub: boolean;
  isOpen: boolean;
  noSelectedPubError: boolean;
  loading: boolean;
  error: any;
  onSubmit: (input: any) => void;
}

const AddPubForm: React.FC<AddPubFormProps> = ({
  isOpen,
  place,
  isNotPub,
  noSelectedPubError,
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

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      name: place?.name ?? "",
      address: place?.address ?? "",
    }));
  }, [place]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      {error && <div style={{ color: "red" }}>{error.message}</div>}
      {!place && (
        <div style={{ color: "green" }}>
          Search for a pub or select a pub on the map to start
        </div>
      )}
      {place && isNotPub && (
        <div style={{ color: "orange" }}>
          Are you sure this is a pub? Google considers it a {place?.type}. You
          can still add this venue but it will have to be manually reviewed
          before others can see it.
        </div>
      )}
      {noSelectedPubError && (
        <div style={{ color: "red" }}>Please select a pub on the map</div>
      )}
      <FormGroup>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
          readOnly
          style={{ opacity: 0.2 }}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="address">Address</Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={formState.address}
          onChange={handleChange}
          required
          readOnly
          style={{ opacity: 0.2 }}
        />
      </FormGroup>

      <FormGroup>
        <Label>Cue Deposit Required</Label>
        <RadioGroup>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isCueDeposit"
              value="Yes"
              checked={formState.isCueDeposit === "Yes"}
              onChange={handleChange}
              disabled={loading}
            />
            Yes
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isCueDeposit"
              value="No"
              checked={formState.isCueDeposit === "No"}
              onChange={handleChange}
              disabled={loading}
            />
            No
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isCueDeposit"
              value="Don't Know"
              checked={formState.isCueDeposit === "Don't Know"}
              onChange={handleChange}
              disabled={loading}
            />
            {"Don't Know"}
          </RadioLabel>
        </RadioGroup>
      </FormGroup>
      <FormGroup>
        <Label>Jumping Whiteball Allowed</Label>
        <RadioGroup>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isJumpingAllowed"
              value="Yes"
              checked={formState.isJumpingAllowed === "Yes"}
              onChange={handleChange}
              disabled={loading}
            />
            Yes
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isJumpingAllowed"
              value="No"
              checked={formState.isJumpingAllowed === "No"}
              onChange={handleChange}
              disabled={loading}
            />
            No
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isJumpingAllowed"
              value="Don't Know"
              checked={formState.isJumpingAllowed === "Don't Know"}
              onChange={handleChange}
              disabled={loading}
            />
            {" Don't Know"}
          </RadioLabel>
        </RadioGroup>
      </FormGroup>
      <FormGroup>
        <Label>Coin On Table Reservation Allowed</Label>
        <RadioGroup>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isPoundOnTable"
              value="Yes"
              checked={formState.isPoundOnTable === "Yes"}
              onChange={handleChange}
              disabled={loading}
            />
            Yes
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isPoundOnTable"
              value="No"
              checked={formState.isPoundOnTable === "No"}
              onChange={handleChange}
              disabled={loading}
            />
            No
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isPoundOnTable"
              value="Don't Know"
              checked={formState.isPoundOnTable === "Don't Know"}
              onChange={handleChange}
              disabled={loading}
            />
            {"Don't Know"}
          </RadioLabel>
        </RadioGroup>
      </FormGroup>
      <FormGroup>
        <Label>Pre-booking Table Allowed</Label>
        <RadioGroup>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isReservationAllowed"
              value="Yes"
              checked={formState.isReservationAllowed === "Yes"}
              onChange={handleChange}
              disabled={loading}
            />
            Yes
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isReservationAllowed"
              value="No"
              checked={formState.isReservationAllowed === "No"}
              onChange={handleChange}
              disabled={loading}
            />
            No
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="isReservationAllowed"
              value="Don't Know"
              checked={formState.isReservationAllowed === "Don't Know"}
              onChange={handleChange}
              disabled={loading}
            />
            {"Don't Know"}
          </RadioLabel>
        </RadioGroup>
      </FormGroup>
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Add Pub"}
      </Button>
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

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
`;

const RadioLabel = styled.label`
  margin-right: 10px;
  display: flex;
  align-items: center;
  width: fit-content;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 10px;
`;

const RadioInput = styled.input`
  margin-right: 5px;
  width: 20px;
  height: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #0070f3;
  min-width: 100px;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;
  justify-content: center;
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #005bb5;
  }
`;
