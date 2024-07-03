import React, { useEffect, useRef, useState } from "react";
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

interface FindPubMapProps {
  pubs: Place[];
  isMinimized: boolean;
  setPlace: (place: Place | null) => void;
}

const FindPubMap: React.FC<FindPubMapProps> = ({
  pubs,
  isMinimized,
  setPlace,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markers: google.maps.Marker[] = [];
  const [isMarkerClicked, setIsMarkerClicked] = useState<boolean>(false);

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

        mapRef.current.addListener("click", () => {
          if (!isMarkerClicked) {
            setPlace(null);
          }
          setIsMarkerClicked(false);
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
          setIsMarkerClicked(true);
        });

        markers.push(marker);
      });
    };

    initializeMap();
  }, [pubs, setPlace]);

  return (
    <Container $isMinimized={isMinimized}>
      <MapComponent id="map" />
    </Container>
  );
};

export default FindPubMap;

interface ContainerProps {
  $isMinimized: boolean;
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  height: ${(props) => (props.$isMinimized ? "calc(100% - 284px)" : `100%`)};
  transition: height 0.4s ease-in-out;
  @media (max-width: 768px) {
    height: ${(props) => (props.$isMinimized ? "22vh" : `100%`)}; // TODO: review this
  }
`;

const MapComponent = styled.div`
  height: 100%;
  width: 100%;
`;
