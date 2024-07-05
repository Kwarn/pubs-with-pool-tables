import { GET_ADMIN } from "@/graphql/queries";
import { useUserStore } from "@/state/userStore";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RequireAdmin = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthComponent: React.FC<P> = (props) => {
    const { localUser } = useUserStore();
    const [loadingInitial, setLoadingInitial] = useState(true); // State to track initial loading
    const {
      data: adminData,
      loading: adminLoading,
      error: adminError,
      refetch: refetchAdmin,
    } = useQuery(GET_ADMIN, {
      variables: { userId: localUser?.id },
      skip: !localUser?.id,
    });
    const router = useRouter();

    useEffect(() => {
      // Check if admin data is loaded and not loading initial
      if (!adminLoading && adminData) {
        setLoadingInitial(false); // Set loadingInitial to false once data is loaded
      }
    }, [adminLoading, adminData]);

    useEffect(() => {
      // Redirect only after initial loading is complete and admin data is available
      if (!loadingInitial && (!adminData || !adminData.admin)) {
        router.push("/");
      }
    }, [loadingInitial, adminData]);

    if (adminLoading || loadingInitial) {
      return <div>Loading...</div>; // Show loading indicator while fetching data
    }

    if (adminData && adminData.admin) {
      return <WrappedComponent {...props} />; // Render the wrapped component if user is admin
    }

    return <div>Unauthorized Access</div>; // Render unauthorized access if user is not admin
  };

  return AuthComponent;
};

export default RequireAdmin;
