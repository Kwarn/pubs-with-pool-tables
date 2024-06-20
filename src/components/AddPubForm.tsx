import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  width: 300px;
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

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
`;

const RadioLabel = styled.label`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const RadioInput = styled.input`
  margin-right: 5px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Option = styled.option`
  font-size: 16px;
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
    availability: "",
    isCueDeposit: "Don't Know",
    isJumpingAllowed: "Don't Know",
    isPoundOnTable: "Don't Know",
    isReservationAllowed: "Don't Know",
  });

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
    console.log("Submitted form with state: ", formState);
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
          <Label htmlFor="availability">Table Availability:</Label>
          <Select
            id="availability"
            name="availability"
            value={formState.availability}
            onChange={handleChange}
            required
          >
            <Option value="">Select availability...</Option>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Cue Deposit Required:</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="isCueDeposit"
                value="Yes"
                checked={formState.isCueDeposit === "Yes"}
                onChange={handleChange}
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
              />
              {"Don't Know"}
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
        <FormGroup>
          <Label>Jumping Allowed:</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="isJumpingAllowed"
                value="Yes"
                checked={formState.isJumpingAllowed === "Yes"}
                onChange={handleChange}
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
              />
              {" Don't Know"}
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
        <FormGroup>
          <Label>Pound On Table Allowed:</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="isPoundOnTable"
                value="Yes"
                checked={formState.isPoundOnTable === "Yes"}
                onChange={handleChange}
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
              />
              {"Don't Know"}
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
        <FormGroup>
          <Label>Reservation Allowed:</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="isReservationAllowed"
                value="Yes"
                checked={formState.isReservationAllowed === "Yes"}
                onChange={handleChange}
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
              />
              {"Don't Know"}
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
        <Button type="submit">Add Pub</Button>
      </Form>
    </Container>
  );
};

export default AddPubForm;
