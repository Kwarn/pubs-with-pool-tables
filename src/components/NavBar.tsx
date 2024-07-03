import Link from "next/link";
import { useRouter } from "next/router";
import Login from "./Login";
import { useUser } from "@auth0/nextjs-auth0/client";
import styled from "styled-components";
import { useState } from "react";

const NavBar = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledNav>
      <BurgerMenu $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <div />
        <div />
        <div />
      </BurgerMenu>
      <Links $isOpen={isOpen}>
        <LinkWrapper
          onClick={() => setIsOpen(false)}
          $active={router.pathname === "/"}
        >
          <Link href="/">Find Pub</Link>
        </LinkWrapper>
        <LinkWrapper
          $active={router.pathname === "/add-pub"}
          onClick={() => setIsOpen(false)}
        >
          <Link
            href={user ? "/add-pub" : "/api/auth/login?returnTo=%2Fadd-pub"}
          >
            Add Pub
          </Link>
        </LinkWrapper>
        {user && (
          <LinkWrapper
            $active={router.pathname === "/pubs-admin"}
            onClick={() => setIsOpen(false)}
          >
            <Link href="/pubs-admin">Pubs Admin</Link>
          </LinkWrapper>
        )}
        <LoginWrapper $isOpen={isOpen}>
          <Login />
        </LoginWrapper>
      </Links>
      <Title>Pubs with pool tables</Title>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  z-index: 10000;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  background-color: #333;
  color: #fff;
  font-size: 1.2rem;
  position: relative;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const BurgerMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
  margin-left: 1rem;

  div {
    width: 2rem;
    height: 0.25rem;
    background: #fff;
    border-radius: 10px;
    transform-origin: 1px;
    transition: opacity 0.3s, transform 0.3s;

    &:nth-child(1) {
      transform: ${({ $isOpen }) => ($isOpen ? "rotate(45deg)" : "rotate(0)")};
    }

    &:nth-child(2) {
      opacity: ${({ $isOpen }) => ($isOpen ? "0" : "1")};
      transform: ${({ $isOpen }) =>
        $isOpen ? "translateX(20px)" : "translateX(0)"};
    }

    &:nth-child(3) {
      transform: ${({ $isOpen }) => ($isOpen ? "rotate(-45deg)" : "rotate(0)")};
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Links = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: row;
  width: 80%;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: ${({ $isOpen }) => ($isOpen ? "60%" : "0")};
    overflow: hidden;
    background-color: #333;
    transition: width 0.3s ease-in-out;
    z-index: 9;
    padding-top: 5rem;
  }
`;

const Title = styled.div`
  position: absolute;
  left: calc(50% - 80px);

  @media (max-width: 768px) {
    position: relative;
    left: auto;
    transform: none;
    text-align: center;
    width: 100%;
  }
`;

const LoginWrapper = styled.div<{ $isOpen: boolean }>`
  margin: 0 1rem;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  }
`;

const LinkWrapper = styled.div<{ $active: boolean }>`
  margin-left: 1rem;
  width: fit-content;

  a {
    width: fit-content;
    color: ${(props) => (props.$active ? "#fff" : "#ccc")};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin: 1rem;
  }
`;

export default NavBar;
