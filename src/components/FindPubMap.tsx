import React, { use, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { styled } from "styled-components";

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

interface FindPubMapProps {
  pubs: Place[];
  setPlace: (place: Place) => void;
}

const FindPubMap: React.FC<FindPubMapProps> = ({ pubs, setPlace }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markers: google.maps.Marker[] = [];

  const [isSmallMap, setIsSmallMap] = useState(false);

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
          setIsSmallMap(true);
        });

        markers.push(marker);
      });
    };

    initializeMap();
  }, [pubs, setPlace]);

  return (
    <Container $isSmallMap={isSmallMap}>
      <MapComponent id="map" />
    </Container>
  );
};

export default FindPubMap;

interface ContainerProps {
  $isSmallMap: boolean;
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  display: flex;
  justify-content: center;
  height: ${(props) =>
    props.$isSmallMap ? "calc(100vh - 390px)" : `calc(100vh - 90px)`};
  transition: height 0.5s ease;
`;

const MapComponent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;
