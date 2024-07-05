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

  const { loading, error, data } = useQuery<{ comments: Comment[] }>(
    GET_PUB_COMMENTS,
    {
      variables: { pubId: pub.id },
    }
  );

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
    <Container id={pub.name}>
      <Details>
        <Name>{pub?.name ?? "unknown"}</Name>
        <Address>{pub?.address || "unknown"}</Address>
        <AddedBy>
          <strong>Added By:</strong> {pub.createdBy ?? "Unknown"}
        </AddedBy>
        <Divider />
        <InfoContainer>
          <Rules>
            <Info>
              <strong>Cue deposit:</strong>
              {getIcon(pub?.rules?.isCueDeposit)}
            </Info>
            <Info>
              <strong>Pre-booking:</strong>
              {getIcon(pub?.rules?.isReservationAllowed)}
            </Info>
            <Info>
              <strong>Jumping balls:</strong>
              {getIcon(pub?.rules?.isJumpingAllowed)}
            </Info>
            <Info>
              <strong>Pound down:</strong>
              {getIcon(pub?.rules?.isPoundOnTable)}
            </Info>
          </Rules>
          <PubInfo>
            {pub.pubInformation && (
              <Info>
                <strong>Number of tables:</strong>
                {pub.pubInformation.numberOfTables}
              </Info>
            )}
            {pub.pubInformation && (
              <Info>
                <strong>Table quality:</strong>{" "}
                {pub.pubInformation.tableQuality}
              </Info>
            )}
            {pub.pubInformation && (
              <Info>
                <strong>Table cost:</strong> {pub.pubInformation.tableCost}
              </Info>
            )}
            {pub.pubInformation && (
              <Info>
                <strong>Cue quality:</strong> {pub.pubInformation.cueQuality}
              </Info>
            )}
            {pub.pubInformation && (
              <Info>
                <strong>Has Chalk:</strong>{" "}
                {getIcon(pub?.pubInformation?.hasChalk)}
              </Info>
            )}
            {pub.pubInformation && (
              <Info>
                <strong>Wheelchair access:</strong>
                {getIcon(pub?.pubInformation?.wheelchairAccess)}
              </Info>
            )}
            {pub.pubInformation && (
              <Info>
                <strong>Kids friendly:</strong>
                {getIcon(pub?.pubInformation?.kidsFriendly)}
              </Info>
            )}
          </PubInfo>
        </InfoContainer>

        {pub.tables && pub.tables.length > 0 && (
          <Info>
            <strong>Tables:</strong>
            <ul>
              {pub?.tables?.map((table) => (
                <li key={table.id}>
                  Size: {table.size}, Quality: {table.quality}, Cost:
                  {table.cost}
                </li>
              ))}
            </ul>
          </Info>
        )}
      </Details>
      <CommentsSection>
        <Comments comments={comments || []} loading={loading} />
        <CommentsForm onSubmit={handleCommentSubmit} />
      </CommentsSection>
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

const Divider = styled.hr`
  height: 2px;
  background-color: ${({ theme }) => theme.colors.text};
`;

const Name = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  text-align: center;
  margin: 30px 0 10px 0;
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
  top: 80px;
  @media (max-width: 768px) {
    top: 0px;
    font-size: 14px;
  }
`;

const Info = styled.div`
  margin-bottom: 10px;

  strong {
    margin-right: 5px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Rules = styled.div`
  display: flex;
  flex-direction: column;
`;

const PubInfo = styled.div`
  display: flex;
  flex-direction: column;
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

export default PubDetails;
