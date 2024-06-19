import React, { useRef, useState, useEffect, ReactElement } from "react";
import styled from "styled-components";

type Position = {
  x: number;
  y: number;
};

type DraggableComponentProps = {
  isVisiable: boolean;
  children: ReactElement;
  toggleIsVisiable: () => void;
};

const DraggableContainer = styled.div<{
  isMinimized: boolean;
  dragging: boolean;
  position: Position;
}>`
  position: ${({ isMinimized }) => (isMinimized ? "fixed" : "absolute")};
  left: ${({ position }) => position.x}px;
  top: ${({ position }) => position.y}px;
  min-width: 200px;
  min-height: ${({ isMinimized }) => (isMinimized ? "0" : "200px")};
  transition: ${({ dragging }) => (!dragging ? "top 0.5s" : "none")};
  cursor: move;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border: 2px solid;
  user-select: none;
`;

const Header = styled.div`
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  color: black;
`;

const Button = styled.div`
  margin-right: 8px;
  cursor: pointer;
`;

const Content = styled.div<{ isMinimized: boolean }>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: ${({ isMinimized }) => (isMinimized ? "0px" : "auto")};
  overflow: ${({ isMinimized }) => (isMinimized ? "hidden" : "visible")};
`;

const DraggableComponent = ({
  isVisiable,
  children,
  toggleIsVisiable,
}: DraggableComponentProps) => {
  const draggableRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({ x: 300, y: 100 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [rel, setRel] = useState<Position>({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [lastPosition, setLastPosition] = useState<Position>({
    x: 300,
    y: 100,
  });

  const toggleMinimize = () => {
    if (isMinimized) {
      setPosition(lastPosition);
      setIsMinimized(false);
      return;
    }
    setIsMinimized(true);
    setLastPosition(position);

    const y = window.innerHeight - 25;
    setPosition({ x: 0, y });
  };

  useEffect(() => {
    setPosition({ x: 300, y: 100 });
  }, [isVisiable]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isMinimized) return toggleMinimize();
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))
      return;

    const node = draggableRef.current;
    if (node) {
      const offsetX = e.pageX - node.offsetLeft;
      const offsetY = e.pageY - node.offsetTop;
      setRel({ x: offsetX, y: offsetY });
      setDragging(true);
    }

    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent): void => {
    if (!dragging) return;

    setPosition({
      x: e.pageX - rel.x,
      y: e.pageY - rel.y,
    });

    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUp = (e: MouseEvent): void => {
    setDragging(false);

    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  return (
    isVisiable && (
      <DraggableContainer
        ref={draggableRef}
        onMouseDown={onMouseDown}
        isMinimized={isMinimized}
        dragging={dragging}
        position={position}
      >
        <Header>
          <Button onClick={toggleMinimize}>_</Button>
          <Button onClick={toggleIsVisiable}>X</Button>
        </Header>
        <Content isMinimized={isMinimized}>{children}</Content>
      </DraggableContainer>
    )
  );
};

export default DraggableComponent;
