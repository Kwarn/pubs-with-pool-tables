import { User } from "@/types";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface UserContextType {
  authUser: UserProfile | null;
  localUser: User | null;
  updateAuthUser: (user: UserProfile | null) => void;
  updateLocalUser: (user: User | null) => void;
  lastRoute: string;
  updateLastRoute: (route: string) => void;
}

const UserStoreContext = createContext<UserContextType>({
  authUser: null,
  localUser: null,
  updateAuthUser: () => {},
  updateLocalUser: () => {},
  lastRoute: "/", // TODO sort this out, it shouldn't live here and we need to change the auth0 redirect uri to a route which handles this.
  updateLastRoute: () => {},
});

export const UserStoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authUser, setUser] = useState<UserProfile | null>(null);
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [lastRoute, setLastRoute] = useState<string>("/");

  const updateAuthUser = (userData: UserProfile | null) => {
    setUser(userData);
  };

  const updateLocalUser = (userData: User | null) => {
    setLocalUser(userData);
  }

  const updateLastRoute = (route: string) => {
    setLastRoute(route);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedLocalUser = localStorage.getItem("localUser");
    if (storedLocalUser) {
      setLocalUser(JSON.parse(storedLocalUser));
    }
    const storedLastRoute = localStorage.getItem("lastRoute");
    if (storedLastRoute) {
      setLastRoute(storedLastRoute);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

  useEffect(() => {
    if (localUser) {
      localStorage.setItem("localUser", JSON.stringify(localUser));
    } else {
      localStorage.removeItem("localUser");
    }
  }, [localUser]);

  useEffect(() => {
    localStorage.setItem("lastRoute", lastRoute);
  }, [lastRoute]);

  return (
    <UserStoreContext.Provider
      value={{
        localUser,
        authUser,
        updateAuthUser,
        updateLocalUser,
        lastRoute,
        updateLastRoute,
      }}
    >
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = (): UserContextType => {
  return useContext(UserStoreContext);
};
