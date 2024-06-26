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
      commentsEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [comments]);

  return (
    <CommentsList>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <CommentsScrollable>
          {comments && comments.length ? (
            comments.map((comment) => (
              <CommentContainer key={comment.id}>
                <p>{comment.text}</p>
                <small>- {comment.author}</small>
              </CommentContainer>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          <div ref={commentsEndRef}></div>
        </CommentsScrollable>
      )}
    </CommentsList>
  );
};

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

export default Comments;
