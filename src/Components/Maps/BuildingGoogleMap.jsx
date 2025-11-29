import React from "react";
import "./BuildingGoogleMap.scss";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

export default function BuildingGoogleMap({ latLong, showMaps }) {
  console.log(latLong);
  console.log(showMaps);
  //coordinates
  let lat = latLong.lat;
  let long = latLong.long;
  //close our map
  const closeMap = () => {
    showMaps(false);
  };
  function Map() {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });
    if (!isLoaded) {
      return (
        <div className="text-primary h1 h-100 w-100 position-absolute t-0 b-0 start-0 end-0 text-center fw-bold pt-5">
          <div
            class="spinner-grow"
            style="width: 3rem; height: 3rem;"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div className=" map-container ">
        <div className="w-100 close-map-box w-100">
          <i
            className="bi bi-x-octagon-fill me-3 close-btn "
            onClick={() => closeMap()}
          ></i>
        </div>
        <div className="w-100 h-100">
          <GoogleMap
            center={{ lat: lat, lng: long }}
            zoom={20}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            <Marker position={{ lat: lat, lng: long }} />
          </GoogleMap>
        </div>
      </div>
    );
  }
  return <Map />;
}
