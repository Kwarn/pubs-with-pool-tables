import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useUserStore } from "@/state/userStore";
import { useMutation } from "@apollo/client";
import { ADD_USER_MUTATION } from "@/graphql/mutations";
import { useRouter } from "next/router";

// Error: Loading initial props cancelled
// https://github.com/vercel/next.js/discussions/21073

const Auth = () => {
  const router = useRouter();
  const { user, isLoading, error } = useUser();
  const { localUser, updateAuthUser, updateLocalUser } = useUserStore();
  const [addUser] = useMutation(ADD_USER_MUTATION);

  useEffect(() => {
    if (user) {
      const createUser = async () => {
        try {
          const { data } = await addUser({
            variables: {
              input: {
                name: user.name,
                email: user.email,
              },
            },
          });
          updateAuthUser(user);
          updateLocalUser(data.addUser);
        } catch (err) {
          console.error("Error creating user:", err);
        }
      };

      createUser();
    }
  }, [user, addUser, router, updateAuthUser, updateLocalUser]);

  useEffect(() => {
    if (error) {
      console.error("Error:", error.message);
    }
  }, [error]);

  useEffect(() => {
    if (localUser) {
      router.push("/");
    }
  }, [localUser, router]);

  return null;
};

export default Auth;
