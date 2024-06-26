import { useUserStore } from "@/state/userStore";
import { useUser } from "@auth0/nextjs-auth0/client";
import React, { useEffect } from "react";
import styled from "styled-components";

const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginContainer = styled.div`
  align-items: center;
  padding: 0;
  margin: 0 5px 0 0;
`;

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
        <>
          <NavLink
            onClick={() => updateLastRoute("/add-pub")}
            href="/api/auth/logout"
          >
            Logout
          </NavLink>
          <span style={{ color: "#fff", marginLeft: "1rem" }}>
            Welcome, {user.name}!
          </span>
        </>
      ) : (
        <NavLink href="/api/auth/login">Login</NavLink>
      )}
    </LoginContainer>
  );
};

export default Login;
