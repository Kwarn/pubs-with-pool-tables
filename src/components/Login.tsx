import { useUserStore } from "@/state/userStore";
import { useUser } from "@auth0/nextjs-auth0/client";

import React, { useEffect } from "react";

const Login = () => {
  const { updateUser } = useUserStore();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      updateUser(user);
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <a href="/api/auth/logout">Logout</a>
      </div>
    );
  } else {
    return (
      <a style={{ color: "white" }} href="/api/auth/login">
        Login
      </a>
    );
  }
};

export default Login;
