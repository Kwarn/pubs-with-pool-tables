import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
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

const Textarea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  height: 100px;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: auto;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #005bb5;
  }
`;

const AddPubForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    area: "",
    description: "",
    isCueDeposit: false,
    isJumpingAllowed: false,
    isPoundOnTable: false,
    isReservationAllowed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted form with state: ", formState);
    // Add your submission logic here
  };

  return (
    <Container>
      <Title>Add a New Pub</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name:</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="area">Area:</Label>
          <Input
            type="text"
            id="area"
            name="area"
            value={formState.area}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Description:</Label>
          <Textarea
            id="description"
            name="description"
            value={formState.description}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="isCueDeposit">
            <Checkbox
              id="isCueDeposit"
              name="isCueDeposit"
              checked={formState.isCueDeposit}
              onChange={handleChange}
            />
            Cue Deposit Required
          </Label>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="isJumpingAllowed">
            <Checkbox
              id="isJumpingAllowed"
              name="isJumpingAllowed"
              checked={formState.isJumpingAllowed}
              onChange={handleChange}
            />
            Jumping Allowed
          </Label>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="isPoundOnTable">
            <Checkbox
              id="isPoundOnTable"
              name="isPoundOnTable"
              checked={formState.isPoundOnTable}
              onChange={handleChange}
            />
            Pound On Table Allowed
          </Label>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="isReservationAllowed">
            <Checkbox
              id="isReservationAllowed"
              name="isReservationAllowed"
              checked={formState.isReservationAllowed}
              onChange={handleChange}
            />
            Reservation Allowed
          </Label>
        </FormGroup>
        <Button type="submit">Add Pub</Button>
      </Form>
    </Container>
  );
};

export default AddPubForm;
