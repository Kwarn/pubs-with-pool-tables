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
    const [loadingInitial, setLoadingInitial] = useState(true);
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
      if (!adminLoading && adminData) {
        setLoadingInitial(false);
      }
    }, [adminLoading, adminData]);

    useEffect(() => {
      if (!loadingInitial && (!adminData || !adminData.admin)) {
        router.push("/");
      }
    }, [loadingInitial, adminData]);

    if (adminLoading || loadingInitial) {
      return <div>Loading...</div>;
    }

    if (adminData && adminData.admin) {
      return <WrappedComponent {...props} />;
    }

    return <div>Unauthorized Access</div>;
  };

  return AuthComponent;
};

export default RequireAdmin;
