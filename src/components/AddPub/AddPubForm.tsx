import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Spinner from "@/components/Spinner";
import { Place } from "./AddPubMap";
import { Pub, PubInput, UpdatePubInput } from "@/types";
import { useUserStore } from "@/state/userStore";
import usePubFormSubmit from "../hooks/usePubFormSubmit";

interface AddPubFormProps {
  editPubDetails?: Pub | null;
  place?: Place | null;
  onSubmitCallback?: (updatedPub: Pub) => void;
}

const AddPubForm: React.FC<AddPubFormProps> = ({
  editPubDetails,
  place,
  onSubmitCallback,
}) => {
  const [isNotPub, setIsNotPub] = useState<boolean>(false);

  useEffect(() => {
    if (place?.type !== "bar") setIsNotPub(true);
    else setIsNotPub(false);
  }, [place]);

  const { handleFormSubmit, loading, error } = usePubFormSubmit();

  const submit = async (
    mode: "create" | "update",
    formData: PubInput | UpdatePubInput
  ) => {
    const pub = await handleFormSubmit(mode, formData);
    if (onSubmitCallback) {
      onSubmitCallback(pub);
    }
  };
  const { localUser } = useUserStore();

  const [formState, setFormState] = useState({
    name: "",
    address: "",
    isCueDeposit: "Don't Know",
    isJumpingAllowed: "Don't Know",
    isPoundOnTable: "Don't Know",
    isReservationAllowed: "Don't Know",
    numberOfTables: "",
    tableQuality: "",
    tableCost: "",
    cueQuality: "",
    hasChalk: "Don't Know",
    wheelchairAccess: "Don't Know",
    kidsFriendly: "Don't Know",
  });

  useEffect(() => {
    // set state to editPubDetails if it exists
    setFormState({
      name: editPubDetails?.name ?? "",
      address: editPubDetails?.address ?? "",
      isCueDeposit: editPubDetails?.rules.isCueDeposit ?? "Don't Know",
      isJumpingAllowed: editPubDetails?.rules.isJumpingAllowed ?? "Don't Know",
      isPoundOnTable: editPubDetails?.rules.isPoundOnTable ?? "Don't Know",
      isReservationAllowed:
        editPubDetails?.rules.isReservationAllowed ?? "Don't Know",
      numberOfTables:
        editPubDetails?.pubInformation?.numberOfTables?.toString() ?? "",
      tableQuality: editPubDetails?.pubInformation?.tableQuality ?? "",
      tableCost: editPubDetails?.pubInformation?.tableCost?.toString() ?? "",
      cueQuality: editPubDetails?.pubInformation?.cueQuality ?? "",
      hasChalk: editPubDetails?.pubInformation?.hasChalk ?? "Don't Know",
      wheelchairAccess:
        editPubDetails?.pubInformation?.wheelchairAccess ?? "Don't Know",
      kidsFriendly:
        editPubDetails?.pubInformation?.kidsFriendly ?? "Don't Know",
    });
  }, [editPubDetails]);

  useEffect(() => {
    // update the name & address formState when place changes
    setFormState((prevState) => ({
      ...prevState,
      name: place?.name ?? "",
      address: place?.address ?? "",
    }));
  }, [place]);

  const handleButtonToggle = (name: keyof typeof formState, value: string) => {
    // handles updating state for multi select buttons
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // handles formatting data for either creating or updating a pub
    e.preventDefault();
    if (!localUser?.name) {
      return; // TODO: need auth redirect
    }

    let submitData: PubInput | UpdatePubInput;

    if (editPubDetails) {
      submitData = {
        updatedBy: localUser.name,
        pubId: editPubDetails.id,
        rules: {
          isCueDeposit: formState.isCueDeposit,
          isJumpingAllowed: formState.isJumpingAllowed,
          isPoundOnTable: formState.isPoundOnTable,
          isReservationAllowed: formState.isReservationAllowed,
        },
        isRequiresManualReview: false, // TODO add manual review logic see types.ts
        pubInformation: {
          numberOfTables: parseInt(formState.numberOfTables),
          tableQuality: formState.tableQuality,
          tableCost: parseFloat(formState.tableCost),
          cueQuality: formState.cueQuality,
          hasChalk: formState.hasChalk,
          wheelchairAccess: formState.wheelchairAccess,
          kidsFriendly: formState.kidsFriendly,
        },
      } as UpdatePubInput;
    } else {
      submitData = {
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
        pubInformation: {
          numberOfTables: parseInt(formState.numberOfTables),
          tableQuality: formState.tableQuality,
          tableCost: parseFloat(formState.tableCost),
          cueQuality: formState.cueQuality,
          hasChalk: formState.hasChalk,
          wheelchairAccess: formState.wheelchairAccess,
          kidsFriendly: formState.kidsFriendly,
        },
        isRequiresManualReview: isNotPub,
        createdBy: localUser.name,
      } as PubInput;
    }

    submit(editPubDetails ? "update" : "create", submitData);
  };

  return (
    <Form onSubmit={handleSubmit} $isOpen={!!place || !!editPubDetails}>
      {error && (
        <Alert $bgColor="#f8d7da">
          <p>{error?.message || "Something went wrong.."}</p>
        </Alert>
      )}
      {!place && !editPubDetails && (
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
        <Label>Number of tables</Label>
        <NumberInput
          type="number"
          value={formState.numberOfTables}
          onChange={(e) =>
            setFormState({
              ...formState,
              numberOfTables: e.target.value,
            })
          }
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Cost of tables (£)</Label>
        <CurrencyInput
          type="number"
          step="0.01"
          value={formState.tableCost}
          onChange={(e) =>
            setFormState({
              ...formState,
              tableCost: e.target.value,
            })
          }
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Quality of tables</Label>
        <Select
          value={formState.tableQuality}
          onChange={(e) =>
            setFormState({
              ...formState,
              tableQuality: e.target.value,
            })
          }
          required
        >
          <option value="">Select quality</option>
          <option value="Low">Low</option>
          <option value="Average">Average</option>
          <option value="High">High</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Quality of cues</Label>
        <Select
          value={formState.cueQuality}
          onChange={(e) =>
            setFormState({
              ...formState,
              cueQuality: e.target.value,
            })
          }
          required
        >
          <option value="">Select quality</option>
          <option value="Low">Low</option>
          <option value="Average">Average</option>
          <option value="High">High</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>is a deposit for the cues required</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "Yes")}
            $selected={formState.isCueDeposit === "Yes"}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "No")}
            $selected={formState.isCueDeposit === "No"}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isCueDeposit", "Don't Know")}
            $selected={formState.isCueDeposit === "Don't Know"}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>
      <FormGroup>
        <Label>is jumping the whiteball allowed</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "Yes")}
            $selected={formState.isJumpingAllowed === "Yes"}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "No")}
            $selected={formState.isJumpingAllowed === "No"}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isJumpingAllowed", "Don't Know")}
            $selected={formState.isJumpingAllowed === "Don't Know"}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>Can you hold a place in queue with a coin</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "Yes")}
            $selected={formState.isPoundOnTable === "Yes"}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "No")}
            $selected={formState.isPoundOnTable === "No"}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isPoundOnTable", "Don't Know")}
            $selected={formState.isPoundOnTable === "Don't Know"}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>Can the tables here be pre-booked</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isReservationAllowed", "Yes")}
            $selected={formState.isReservationAllowed === "Yes"}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("isReservationAllowed", "No")}
            $selected={formState.isReservationAllowed === "No"}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() =>
              handleButtonToggle("isReservationAllowed", "Don't Know")
            }
            $selected={formState.isReservationAllowed === "Don't Know"}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup>
        <Label>is there usually chaulk</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("hasChalk", "Yes")}
            $selected={formState.hasChalk === "Yes"}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("hasChalk", "No")}
            $selected={formState.hasChalk === "No"}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("hasChalk", "Don't Know")}
            $selected={formState.hasChalk === "Don't Know"}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>
      <FormGroup>
        <Label>Are the tables kids friendly</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("kidsFriendly", "Yes")}
            $selected={formState.kidsFriendly === "Yes"}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("kidsFriendly", "No")}
            $selected={formState.kidsFriendly === "No"}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("kidsFriendly", "Don't Know")}
            $selected={formState.kidsFriendly === "Don't Know"}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>
      <FormGroup>
        <Label>Is there wheelchair access to the tables</Label>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => handleButtonToggle("wheelchairAccess", "Yes")}
            $selected={formState.wheelchairAccess === "Yes"}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("wheelchairAccess", "No")}
            $selected={formState.wheelchairAccess === "No"}
          >
            No
          </Button>
          <Button
            type="button"
            onClick={() => handleButtonToggle("wheelchairAccess", "Don't Know")}
            $selected={formState.wheelchairAccess === "Don't Know"}
          >
            {"Don't Know"}
          </Button>
        </ButtonGroup>
      </FormGroup>
      <SubmitButton type="submit">
        {loading ? (
          <Spinner size="sm" />
        ) : editPubDetails ? (
          "Update pub"
        ) : (
          "Add Pub"
        )}
      </SubmitButton>
    </Form>
  );
};

export default AddPubForm;

const Form = styled.form<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px 30px 20px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    height: ${({ $isOpen }) => ($isOpen ? "100%" : "0")};
    display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
    width: 100%;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 10px;
`;

const NumberInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #a1afa0;
  border-radius: 4px;
  margin-top: 5px;
  box-sizing: border-box;
`;

const CurrencyInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #a1afa0;
  border-radius: 4px;
  margin-top: 5px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #a1afa0;
  border-radius: 4px;
  margin-top: 5px;
  box-sizing: border-box;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
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
  color: ${({ theme }) => theme.colors.text};
`;

const PlaceTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
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
  font-family: ${({ theme }) => theme.fonts.heading};
  margin: 15px 10px 20px 10px;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  @media (max-width: 768px) {
    margin: 10px 0;
  }
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
