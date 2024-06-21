import React from "react";
import styled, { keyframes } from "styled-components";

interface SpinnerWrapperProps {
  size: "sm" | "md" | "lg";
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div<SpinnerWrapperProps>`
  margin: auto;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: ${(props) =>
    props.size === "sm" ? "16px" : props.size === "lg" ? "32px" : "24px"};
  height: ${(props) =>
    props.size === "sm" ? "16px" : props.size === "lg" ? "32px" : "24px"};
  border-width: ${(props) =>
    props.size === "sm" ? "2px" : props.size === "lg" ? "6px" : "4px"};
  animation: ${spin} 1s linear infinite;
`;

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md" }) => {
  return <SpinnerWrapper size={size} />;
};

export default Spinner;
