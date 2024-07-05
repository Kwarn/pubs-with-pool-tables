import { useUserStore } from "@/state/userStore";
import React, { useState } from "react";
import styled from "styled-components";

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState("");
  const { localUser } = useUserStore();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText) {
      onSubmit(commentText);
      setCommentText("");
    }
  };


  return (
    <Form onSubmit={handleCommentSubmit}>
      {localUser ? (
        <>
          <Textarea
            placeholder="Your Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </>
      ) : (
        <p>Login to add comments</p>
      )}
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const Textarea = styled.textarea`
  height: 40px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ddd;
  resize: none;
`;

const Button = styled.button`
  height: 100%;
  padding: 10px;
  margin-left: 10px;
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  margin-bottom: 0;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

export default CommentForm;
