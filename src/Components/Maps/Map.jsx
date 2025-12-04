import React, { useEffect, useState } from "react";
import "./BuildingGoogleMap.scss";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import BuildingsList from "../../assets/APIs/BuildingsList.json";
import RingLoader from "react-spinners/RingLoader";

export default function Map() {
  const [active, setActive] = useState("");
  const [geoLocation, setGeoLocation] = useState({});
  const [directions, setDirections] = useState(null);

  // request user location enabling
  useEffect(() => {
    return () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGeoLocation(position.coords);
            return;
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        alert("Better to enable your location for best way to follow.");
        console.log("geolocation is not enabled");
      }
    };
  }, [navigator.geolocation]);

  // map shortest routing
  useEffect(() => {
    const getDirections = async () => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${geoLocation.latitude},${geoLocation.longitude}&destination=-1.957935,30.064344&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const routes = data.routes;
        const bounds = {
          northEast: {
            lat: routes[0].bounds.northeast.lat,
            lng: routes[0].bounds.northeast.lng,
          },
          southWest: {
            lat: routes[0].bounds.southwest.lat,
            lng: routes[0].bounds.southwest.lng,
          },
        };
        setDirections({ routes, bounds });
      } else {
        console.error(data.error_message);
      }
    };
    getDirections();
  }, []);

  const handleBuildingClick = (building, id) => {
    setActive(id);
    setGeoLocation({
      latitude: building.location.lat,
      longitude: building.location.long,
    });
  };
  const buildings = BuildingsList.map((building, i) => (
    <li
      key={i}
      className={active === i ? "active list-group-item" : " list-group-item"}
      onClick={() => handleBuildingClick(building, i)}
    >
      {building.name}
    </li>
  ));
  //load map
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  //when not loaded!
  if (!isLoaded) {
    return (
      <RingLoader
        color="#fff"
        loading={isLoaded}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }

  return (
    <div className=" container-fluid map  mt-4 mb-5">
      <h3 className="h2 my-4 text-dark titles-buildings fw-bold w-100 text-center">
        {" "}
        CST Map
      </h3>
      <div className="row ">
        <div className="col-2 col-md-3 bg-light buildings-box">
          <p className="fw-bold my-3">All CST Buildings</p>
          <ul className="list-group w-100 m-0 p-0 box">{buildings}</ul>
        </div>
        <div className="col-10 col-md-9 map-box">
          <GoogleMap
            center={{ at: geoLocation.latitude, lng: geoLocation.longitude }}
            zoom={17}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {/* current location marker */}
            {/* <Marker
              key={0}
              position={{
                lat: geoLocation.latitude,
                lng: geoLocation.longitude,
              }}
              icon={{
                url: markerRegionIcon,
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              title="Your current location"
            /> */}

            {/* loop through map markers */}
            {/* {BuildingsList.map((building, i) => (
              <Marker
                key={++i}
                position={{
                  lat: building.location.lat,
                  lng: building.location.long,
                }}
                icon={{
                  url: markerCurrentIcon,
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
                title={building.name}
              />
            ))} */}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}
