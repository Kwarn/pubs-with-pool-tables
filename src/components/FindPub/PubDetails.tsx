import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Pub, CommentInput, Comment } from "@/types";
import { GET_PUB_COMMENTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { useUserStore } from "@/state/userStore";
import Comments from "../Comments/Comments";
import CommentsForm from "@/components/Comments/CommentsForm";

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
  const { user } = useUserStore();

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
      author: user?.name ?? "unknown",
      pubId: pub.id,
    });
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
        <Block>
          <Rules>
            <Info>
              <strong>Cue Deposit Required:</strong>{" "}
              {pub?.rules?.isCueDeposit || "unknown"}
            </Info>
            <Info>
              <strong>Pre-booking Table Allowed:</strong>
              {pub?.rules?.isReservationAllowed || "unknown"}
            </Info>
            <Info>
              <strong>Jumping Whiteball Allowed:</strong>
              {pub?.rules?.isJumpingAllowed || "unknown"}
            </Info>
            <Info>
              <strong>Coin On Table Reservation Allowed:</strong>
              {pub?.rules?.isPoundOnTable || "unknown"}
            </Info>
          </Rules>
        </Block>
        {pub.tables && pub.tables.length > 0 && (
          <Info>
            <strong>Tables:</strong>
            <ul>
              {pub?.tables?.map((table) => (
                <li key={table.id}>
                  Size: {table.size}, Quality: {table.quality}, Cost:{" "}
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
  display: flex;
  height: 100%;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const Details = styled.div`
  width: 100%;
  padding: 0 20px;
`;

const Divider = styled.hr`
  height: 2px;
  background-color: black;
`;

const Name = styled.h1`
  text-align: center;
  margin-bottom: 10px;
`;

const Address = styled.p`
  text-align: center;
  font-size: 18px;
`;

const AddedBy = styled.p`
  position: absolute;
  top: 80px;
`;

const Info = styled.div`
  margin-bottom: 10px;

  strong {
    margin-right: 5px;
  }
`;

const Block = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Rules = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentsSection = styled.div`
  margin-right: 10px;
  width: 40%;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export default PubDetails;
