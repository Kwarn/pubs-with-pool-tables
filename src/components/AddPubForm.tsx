import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MapComponent, { Place } from "./Map";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1;
  &:not(:last-child) {
    margin-right: 20px;
  }
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
  align-self: flex-start;

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
    location: "",
    description: "",
    availability: "",
    isCueDeposit: "Don't Know",
    isJumpingAllowed: "Don't Know",
    isPoundOnTable: "Don't Know",
    isReservationAllowed: "Don't Know",
  });

  const [place, setPlace] = useState<Place | null>(null);

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

  useEffect(() => {
    console.log("Place: ", place);
    setFormState((prevState) => ({
      ...prevState,
      name: place?.name || "",
      location: place?.address || "",
    }));
  }, [place]);

  return (
    <Container>
      <Title>Add a New Pub</Title>
      <MapComponent setPlace={setPlace} />
      <Form onSubmit={handleSubmit}>
        <Column>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="location">Area</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formState.location}
              onChange={handleChange}
              required
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="availability">Table Availability</Label>
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
        </Column>
        <Column>
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
            <Label>Jumping Whiteball Allowed</Label>
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
            <Label>Coin On Table Reservation Allowed</Label>
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
            <Label>Pre-booking Table Allowed</Label>
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
        </Column>
      </Form>
    </Container>
  );
};

export default AddPubForm;
