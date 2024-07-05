import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import styled from "styled-components";
import SearchBar from "@/components/AddPub/SearchBar";

const center = {
  // London
  lat: 51.5074,
  lng: -0.1278,
};

export interface Place {
  name: string;
  lat: number;
  lng: number;
  type: string;
  address: string;
}

const AddPubMap = ({
  setPlace,
  place,
}: {
  setPlace: (place: Place | null) => void;
  place: Place | null;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [google, setGoogle] = useState<any>(null); // TODO: type this
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
    });

    const initializeMap = async () => {
      const google = await loader.load();
      await google.maps.importLibrary("places");
      setGoogle(google);

      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
        });
        setGoogleMap(map);

        map.addListener(
          "click",
          (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
            if ((event as google.maps.IconMouseEvent).placeId) {
              const _event = event as google.maps.IconMouseEvent;
              const request = {
                placeId: _event.placeId ?? "",
                fields: ["name", "types", "formatted_address", "geometry"],
              };

              const placesService = new google.maps.places.PlacesService(map);
              placesService.getDetails(request, (placeResult, status) => {
                if (
                  status === google.maps.places.PlacesServiceStatus.OK &&
                  placeResult
                ) {
                  const placeInfo: Place = {
                    name: placeResult.name ?? "Unknown Place",
                    lat: placeResult.geometry?.location?.lat() ?? 0,
                    lng: placeResult.geometry?.location?.lng() ?? 0,
                    type: placeResult.types ? placeResult.types[0] : "unknown",
                    address: placeResult.formatted_address ?? "Unknown Address",
                  };

                  setPlace(placeInfo);
                } else {
                  setPlace(null);
                }
              });
            } else {
              setPlace(null);
            }
          }
        );
      }
    };

    initializeMap();
  }, []);

  return (
    <Container>
      {google && googleMap && !place && (
        <SearchBar google={google} googleMap={googleMap} setPlace={setPlace} />
      )}
      <MapContainer ref={mapRef} />
    </Container>
  );
};

export default AddPubMap;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;
