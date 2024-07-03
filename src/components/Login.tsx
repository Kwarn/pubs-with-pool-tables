import { useUserStore } from "@/state/userStore";
import { useUser } from "@auth0/nextjs-auth0/client";
import React, { useEffect } from "react";
import styled from "styled-components";

const Login = () => {
  const { updateUser, updateLastRoute } = useUserStore();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      updateUser(user);
    }
  }, [user]);

  if (isLoading) return <NavLink>Loading...</NavLink>;

  if (error) return <NavLink>{error.message}</NavLink>;

  return (
    <LoginContainer>
      {user ? (
        <LinkWrapper>
          <NavLink
            onClick={() => updateLastRoute("/add-pub")}
            href="/api/auth/logout"
          >
            Logout
          </NavLink>
        </LinkWrapper>
      ) : (
        <LinkWrapper>
          <NavLink href="/api/auth/login">Login</NavLink>
        </LinkWrapper>
      )}
    </LoginContainer>
  );
};

export default Login;

const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LinkWrapper = styled.div<{ $active?: boolean }>`
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
    margin: 1rem 0;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0 5px 0 0;
`;
