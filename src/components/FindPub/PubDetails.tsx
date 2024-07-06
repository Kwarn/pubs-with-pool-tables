import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Pub, CommentInput, Comment } from "@/types";
import { GET_PUB_COMMENTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { useUserStore } from "@/state/userStore";
import Comments from "../Comments/Comments";
import CommentsForm from "@/components/Comments/CommentsForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faQuestion,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/Modal";
import AddPubForm from "@/components/AddPub/AddPubForm";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

interface PubDetailsProps {
  pub: Pub;
  onAddComment: (comment: CommentInput) => void;
  newComment: Comment | null;
}

const PubDetails: React.FC<PubDetailsProps> = ({
  pub,
  onAddComment,
  newComment,
}) => {
  const { localUser } = useUserStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPub, setSelectedPub] = useState<Pub>(pub);

  const { loading, error, data } = useQuery<{ comments: Comment[] }>(
    GET_PUB_COMMENTS,
    {
      variables: { pubId: pub.id },
    }
  );

  const handlePubUpdateSubmit = async (updatedPub: Pub) => {
    setIsModalOpen(false);
    setSelectedPub(updatedPub);
  };

  const handleCommentSubmit = (text: string) => {
    onAddComment({
      text,
      author: localUser?.name ?? "unknown",
      pubId: pub.id,
    });
  };

  const getIcon = (value: string | null) => {
    if (!value) {
      return <FontAwesomeIcon icon={faQuestion} />;
    }
    if (value === "Yes") {
      return <FontAwesomeIcon icon={faCheck} />;
    }
    if (value === "No") {
      return <FontAwesomeIcon icon={faTimes} />;
    }
    return <FontAwesomeIcon icon={faQuestion} />;
  };

  useEffect(() => {
    if (pub) {
      setSelectedPub(pub);
    }
  }, [pub]);

  useEffect(() => {
    if (data?.comments) {
      setComments(data.comments);
    }
  }, [data?.comments]);

  useEffect(() => {
    if (newComment) {
      setComments((prevComments) => [...prevComments, newComment]);
    }
  }, [newComment]);

  return (
    <Container id={selectedPub.name}>
      <Details>
        <AddedBy>
          <strong>Added By:</strong> {selectedPub.createdBy ?? "Unknown"}
        </AddedBy>

        <Name>
          {selectedPub?.name ?? "unknown"}{" "}
          <EditButton onClick={() => setIsModalOpen(true)}>
            <EditIcon icon={faPencilAlt} />
          </EditButton>
        </Name>
        <Address>{selectedPub?.address || "unknown"}</Address>
        <InfoContainer>
          <Rules>
            <Info>
              <strong>Cue deposit</strong>
              {getIcon(selectedPub?.rules?.isCueDeposit)}
            </Info>
            <Info>
              <strong>Pre-booking</strong>
              {getIcon(selectedPub?.rules?.isReservationAllowed)}
            </Info>
            <Info>
              <strong>Jumping balls</strong>
              {getIcon(selectedPub?.rules?.isJumpingAllowed)}
            </Info>
            <Info>
              <strong>Pound down</strong>
              {getIcon(selectedPub?.rules?.isPoundOnTable)}
            </Info>
          </Rules>
          <PubInfo>
            {selectedPub.pubInformation && (
              <Info>
                <strong>Number of tables</strong>
                {selectedPub.pubInformation.numberOfTables}
              </Info>
            )}
            {selectedPub.pubInformation && (
              <Info>
                <strong>Table quality</strong>{" "}
                {selectedPub.pubInformation.tableQuality}
              </Info>
            )}
            {selectedPub.pubInformation && (
              <Info>
                <strong>Table cost</strong> £
                {selectedPub.pubInformation.tableCost}
              </Info>
            )}
            {selectedPub.pubInformation && (
              <Info>
                <strong>Cue quality</strong>{" "}
                {selectedPub.pubInformation.cueQuality}
              </Info>
            )}
            {selectedPub.pubInformation && (
              <Info>
                <strong>Has Chalk</strong>{" "}
                {getIcon(selectedPub?.pubInformation?.hasChalk)}
              </Info>
            )}
            {selectedPub.pubInformation && (
              <Info>
                <strong>Wheelchair access</strong>
                {getIcon(selectedPub?.pubInformation?.wheelchairAccess)}
              </Info>
            )}
            {selectedPub.pubInformation && (
              <Info>
                <strong>Kids friendly</strong>
                {getIcon(selectedPub?.pubInformation?.kidsFriendly)}
              </Info>
            )}
          </PubInfo>
        </InfoContainer>
      </Details>
      <CommentsSection>
        <Comments comments={comments || []} loading={loading} />
        <CommentsForm onSubmit={handleCommentSubmit} />
      </CommentsSection>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddPubForm
          editPubDetails={selectedPub}
          onSubmitCallback={handlePubUpdateSubmit}
        />
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  overflow-y: auto;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  background-color: ${({ theme }) => theme.colors.primary};
  height: 100%;
  border: 1px solid #ccc;
  justify-content: space-between;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 1rem;
  }
`;

const Details = styled.div`
  width: 100%;
  padding: 0 20px;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Name = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  text-align: center;
  margin: 30px 0 10px 25px;
  @media (max-width: 768px) {
    margin-top: 4rem;
    font-size: 0.8rem;
  }
`;

const Address = styled.p`
  text-align: center;
  font-size: 18px;
`;

const AddedBy = styled.p`
  text-align: left;
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const Info = styled.div`
  margin: 10px 10px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;

  strong {
    margin-right: 5px;
  }
`;

const Rules = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PubInfo = styled.div`
  display: flex;
  flex-direction: rpw;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CommentsSection = styled.div`
  margin-right: 10px;
  width: 40%;
  display: flex;
  height: 100%;
  flex-direction: column;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    width: 100%;
    height: 30%;
  }
`;

const EditButton = styled.button`
  font-family: ${({ theme }) => theme.fonts.heading};
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  border: none;
  padding: 5px 5px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  &:hover {
    background: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

const EditIcon = styled(FontAwesomeIcon)`
  margin: auto;
`;

export default PubDetails;
