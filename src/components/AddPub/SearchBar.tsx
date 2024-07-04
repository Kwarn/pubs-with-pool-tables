import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Place } from "./AddPubMap";

interface SearchBarProps {
  google: typeof google;
  googleMap: google.maps.Map;
  setPlace: (place: Place) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  google,
  googleMap,
  setPlace,
}) => {
  const [selectedPlaceName, setSelectedPlaceName] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 200);

    return () => clearTimeout(focusTimeout);
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      const input = searchInputRef.current;
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
    }
  }, [google, googleMap, setPlace]);

  const clearSearch = () => {
    setSelectedPlaceName("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      searchInputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlaceName(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        ref={searchInputRef}
        placeholder="Search for a pub..."
        onChange={handleInputChange}
      />
      {selectedPlaceName && (
        <ClearButton onClick={clearSearch}>
          <FontAwesomeIcon icon={faTimes} />
        </ClearButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;

const SearchContainer = styled.div`
  z-index: 2;
  position: absolute;
  left: calc(50% - 400px);
  top: 10vh;
  width: 30vw;
  border: 4px solid white;
  padding: 0;
  margin: 0;
  @media (max-width: 768px) {
    width: 85vw;
    top: 14vh;
    left: calc(50% - 40vw - 20px);
  }
`;

const SearchInput = styled.input`
  padding: 0;
  margin: 0;
  height: 40px;
  font-size: 20px;
  width: 100%;
`;

const ClearButton = styled.button`
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  @media (max-width: 768px) {
    right: -30px;
  }
`;
