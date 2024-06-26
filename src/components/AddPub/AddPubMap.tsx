import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import styled from "styled-components";

const center = {
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

const AddPubMap = ({ setPlace }: { setPlace: (place: Place) => void }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
    });

    const initializeMap = async () => {
      const google = await loader.load();
      await google.maps.importLibrary("places");

      if (mapRef.current) {
        const googleMap = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
        });

        const input = searchInputRef.current as HTMLInputElement;
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo("bounds", googleMap);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) {
            return;
          }

          googleMap.setCenter(place.geometry.location);
          googleMap.setZoom(15);

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const placeInfo: Place = {
            name: place.name || "Unknown Place",
            lat: lat,
            lng: lng,
            type: place.types ? place.types[0] : "unknown",
            address: place.formatted_address || "Unknown Address",
          };

          setPlace(placeInfo);

          googleMap.data.forEach((feature) => {
            googleMap.data.remove(feature);
          });

          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: googleMap,
            title: placeInfo.name,
          });

          marker.addListener("click", () => {
            setPlace(placeInfo);
          });
        });

        googleMap.addListener(
          "click",
          (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
            if ((event as google.maps.IconMouseEvent).placeId) {
              const _event = event as google.maps.IconMouseEvent;
              const request = {
                placeId: _event.placeId || "",
                fields: ["name", "types", "formatted_address", "geometry"],
              };

              const placesService = new google.maps.places.PlacesService(
                googleMap
              );
              placesService.getDetails(request, (placeResult, status) => {
                if (
                  status === google.maps.places.PlacesServiceStatus.OK &&
                  placeResult
                ) {
                  const placeInfo: Place = {
                    name: placeResult.name || "Unknown Place",
                    lat: placeResult.geometry?.location?.lat() || 0,
                    lng: placeResult.geometry?.location?.lng() || 0,
                    type: placeResult.types ? placeResult.types[0] : "unknown",
                    address: placeResult.formatted_address || "Unknown Address",
                  };

                  setPlace(placeInfo);
                }
              });
            }
          }
        );
      }
    };

    initializeMap();
  }, []);

  return (
    <Container>
      <SearchInput
        type="text"
        ref={searchInputRef}
        placeholder="Search for a Pub"
      />
      <MapContainer ref={mapRef} />
    </Container>
  );
};

export default AddPubMap;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const SearchInput = styled.input`
  align-self: center;
  width: 500px;
  height: 30px;
  margin-bottom: 10px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
`;
