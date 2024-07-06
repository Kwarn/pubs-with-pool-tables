import { useState } from "react";
import { useMutation } from "@apollo/client";
import { PubInput, UpdatePubInput } from "@/types";
import { CREATE_PUB_MUTATION, UPDATE_PUB_MUTATION } from "@/graphql/mutations";
import { GET_PUBS } from "@/graphql/queries";

const usePubFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const [createPubMutation] = useMutation(CREATE_PUB_MUTATION);
  const [updatePubMutation] = useMutation(UPDATE_PUB_MUTATION);

  const handleFormSubmit = async (
    mode: "create" | "update",
    formData: PubInput | UpdatePubInput
  ) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (mode === "update") {
        result = await updatePubMutation({
          variables: { input: formData },
          update: (cache, { data }) => {
            const updatedPub = data?.updatePub;
            const existingPubs = cache.readQuery<any>({
              query: GET_PUBS,
            });
            if (existingPubs && updatedPub) {
              cache.writeQuery({
                query: GET_PUBS,
                data: {
                  pubs: existingPubs.pubs.map((pub: any) =>
                    pub.id === updatedPub.id ? updatedPub : pub
                  ),
                },
              });
            }
          },
        });
      } else {
        result = await createPubMutation({ variables: { input: formData } });
      }
      setLoading(false);
      return mode === "update" ? result?.data.updatePub : result?.data.addPub;
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error);
      setLoading(false);
      return null;
    }
  };

  return {
    handleFormSubmit,
    loading,
    error,
  };
};

export default usePubFormSubmit;
