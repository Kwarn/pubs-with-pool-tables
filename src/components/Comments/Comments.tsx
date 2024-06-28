import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Comment } from "@/types";
import Spinner from "@/components/Spinner";

interface PubCommentsProps {
  comments: Comment[];
  loading: boolean;
}

const Comments: React.FC<PubCommentsProps> = ({ comments, loading }) => {
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  return (
    <CommentsList>
      {loading ? (
        <Spinner size="md" />
      ) : comments && comments.length ? (
        <CommentsScrollable>
          {comments.map((comment) => (
            <CommentContainer key={comment.id}>
              <CommentText>{comment.text}</CommentText>
              <Author>- {comment.author}</Author>
            </CommentContainer>
          ))}
          <div ref={commentsEndRef}></div>
        </CommentsScrollable>
      ) : (
        <NoComments>No comments yet.</NoComments>
      )}
    </CommentsList>
  );
};

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 240px;
  height: 100%;
`;

const CommentsScrollable = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
`;

const CommentContainer = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  width: 100%;
`;

const CommentText = styled.p`
  margin: 0;
`;

const Author = styled.small`
  font-size: 10px;
`;

const NoComments = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  margin: 0;
`;

export default Comments;
