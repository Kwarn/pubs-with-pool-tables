import FindPubMap, { Place } from "@/components/FindPubMap";
import { GET_PUBS } from "@/graphql/queries";
import { Pub } from "@/types";
import { useQuery } from "@apollo/client";
import React from "react";

const Map = () => {
  const { data, loading, error, refetch } = useQuery<{ pubs: Pub[] }>(GET_PUBS);
  const [place, setPlace] = React.useState<Place | null>(null);



  const pubs = data?.pubs.map((pub) => ({
    name: pub.name,
    lat: pub.location.lat,
    lng: pub.location.lng,
    type: "pub",
    address: pub.address,
  }));

  return <>{pubs && <FindPubMap setPlace={setPlace} pubs={pubs} />}
  {place && <div>{place.name}</div>}
  </>;
};

export default Map;
