import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Pub, CommentInput, Comment } from "@/types";
import { GET_PUB_COMMENTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { useUserStore } from "@/state/userStore";
import Spinner from "../Spinner";
import PubComments from "./Comments/PubComments";

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
  const [commentText, setCommentText] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);

  const { loading, error, data } = useQuery<{ comments: Comment[] }>(
    GET_PUB_COMMENTS,
    {
      variables: { pubId: pub.id },
    }
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText) {
      onAddComment({
        text: commentText,
        author: user?.name || "unknown",
        pubId: pub.id,
      });
      setCommentText("");
    }
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
        <Info>
          <strong>Address:</strong> {pub?.address || "unknown"}
        </Info>
        <Info>
          <strong>Description:</strong> {pub.description}
        </Info>
        <Info>
          <strong>Created By:</strong> {pub.createdBy ?? "Unknown"}
        </Info>
        <Info>
          <strong>Cue Deposit Required:</strong> {pub.rules.isCueDeposit}
        </Info>
        <Info>
          <strong>Jumping Whiteball Allowed:</strong>{" "}
          {pub.rules.isJumpingAllowed}
        </Info>
        <Info>
          <strong>Coin On Table Reservation Allowed:</strong>{" "}
          {pub.rules.isPoundOnTable}
        </Info>
        <Info>
          <strong>Pre-booking Table Allowed:</strong>{" "}
          {pub.rules.isReservationAllowed}
        </Info>
        {pub.tables && pub.tables.length > 0 && (
          <Info>
            <strong>Tables:</strong>
            <ul>
              {pub.tables.map((table) => (
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
        <PubComments comments={comments || []} loading={loading} />
        <CommentForm onSubmit={handleCommentSubmit}>
          <h3>Add a Comment</h3>
          <Textarea
            placeholder="Your Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </CommentForm>
      </CommentsSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const Details = styled.div`
  width: 60%;
`;

const Name = styled.h2`
  margin-bottom: 10px;
`;

const Info = styled.div`
  margin-bottom: 10px;

  strong {
    margin-right: 5px;
  }
`;

const CommentsSection = styled.div`
  width: 35%;
  display: flex;
  flex-direction: column;
`;

const CommentsList = styled.div`
  margin-bottom: 20px;
`;

const CommentsScrollable = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const CommentContainer = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;

  p {
    margin: 0;
  }

  small {
    color: #555;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Textarea = styled.textarea`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

export default PubDetails;
