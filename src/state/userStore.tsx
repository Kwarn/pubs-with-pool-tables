import { UserProfile } from "@auth0/nextjs-auth0/client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface UserContextType {
  user: UserProfile | null;
  updateUser: (user: UserProfile | null) => void;
  lastRoute: string;
  updateLastRoute: (route: string) => void;
}

const UserStoreContext = createContext<UserContextType>({
  user: null,
  updateUser: () => {},
  lastRoute: "/",
  updateLastRoute: () => {},
});

export const UserStoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lastRoute, setLastRoute] = useState<string>("/");

  const updateUser = (userData: UserProfile | null) => {
    setUser(userData);
  };

  const updateLastRoute = (route: string) => {
    setLastRoute(route);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedLastRoute = localStorage.getItem("lastRoute");
    if (storedLastRoute) {
      setLastRoute(storedLastRoute);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("lastRoute", lastRoute);
  }, [lastRoute]);

  return (
    <UserStoreContext.Provider
      value={{
        user,
        updateUser,
        lastRoute,
        updateLastRoute,
      }}
    >
      {children}
    </UserStoreContext.Provider>
  );
};

// Custom hook to consume the context
export const useUserStore = (): UserContextType => {
  return useContext(UserStoreContext);
};
