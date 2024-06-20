import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = { // london
  lat: 51.5074,
  lng: -0.1278,
};

interface Place {
  name: string;
  lat: number;
  lng: number;
  type: string;
  address: string;
}

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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

          setSelectedPlace(placeInfo);

          googleMap.data.forEach((feature) => {
            googleMap.data.remove(feature);
          });

          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: googleMap,
            title: placeInfo.name,
          });

          marker.addListener("click", () => {
            setSelectedPlace(placeInfo);
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

                  setSelectedPlace(placeInfo);
                }
              });
            }
          }
        );

        setMap(googleMap);
      }
    };

    initializeMap();
  }, []);

  return (
    <div>
      <input
        type="text"
        ref={searchInputRef}
        placeholder="Search for a location"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <div style={containerStyle} ref={mapRef}></div>
      {selectedPlace && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            background: "white",
            padding: "10px",
          }}
        >
          <h2>{selectedPlace.name}</h2>
          <p>{selectedPlace.type}</p>
          <p>{selectedPlace.address}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
