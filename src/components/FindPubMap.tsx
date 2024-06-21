import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const containerStyle = {
  width: "100%",
  height: "600px",
};

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

interface MapProps {
  pubs: Place[];
  setPlace: (place: Place) => void;
}

const Map: React.FC<MapProps> = ({ pubs, setPlace }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markers: google.maps.Marker[] = [];

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
    });

    const initializeMap = async () => {
      const google = await loader.load();
      await google.maps.importLibrary("places");

      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(document.getElementById("map")!, {
          center,
          zoom: 12,
        });
      }
      addMarkers(pubs);
    };

    const addMarkers = (pubsToAdd: Place[]) => {
      if (!mapRef.current) return;

      markers.forEach((marker) => marker.setMap(null));
      markers.length = 0;
      
      pubsToAdd.forEach((pub) => {
        const marker = new google.maps.Marker({
          position: { lat: pub.lat, lng: pub.lng },
          map: mapRef.current!,
          title: pub.name,
        });

        marker.addListener("click", () => {
          setPlace(pub);
        });

        markers.push(marker);
      });
    };

    initializeMap();
  }, [pubs, setPlace]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div id="map" style={containerStyle} />
    </div>
  );
};

export default Map;
