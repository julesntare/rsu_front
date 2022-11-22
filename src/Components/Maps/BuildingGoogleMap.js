import React, { useMemo, useState }  from "react";
import "./BuildingGoogleMap.scss";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";


export default  function BuildingGoogleMap ({lat, long, id}) {
// console.log(lat, long, id, "aos")

  const { isLoaded } = useLoadScript({
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    googleMapsApiKey: "AIzaSyAcPL8H587x3SptbHKtuZnMbl6YQPdtoFE"
  });
  const   Loading = (
    <svg id="loading-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <defs>
        <linearGradient id="spinner-gradient-a" x1="49.892%" x2="55.03%" y1="58.241%" y2="89.889%">
          <stop offset="0%"/>
          <stop offset="22.44%" stop-opacity=".59"/>
          <stop offset="100%" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <g fill="none" transform="translate(-8 -8)">
        <path d="M32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 C56,45.254834 45.254834,56 32,56 Z M32,52 C43.045695,52 52,43.045695 52,32 C52,20.954305 43.045695,12 32,12 C20.954305,12 12,20.954305 12,32 C12,43.045695 20.954305,52 32,52 Z"/>
        <path fill="url(#spinner-gradient-a)" d="M56,32 C56,33.1045695 55.1045695,34 54,34 C52.8954305,34 52,33.1045695 52,32 C52,20.954305 43.045695,12 32,12 C20.954305,12 12,20.954305 12,32 C12,43.045695 20.954305,52 32,52 C33.1045695,52 34,52.8954305 34,54 C34,55.1045695 33.1045695,56 32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 Z" transform="rotate(45 32 32)"/>
      </g>
    </svg>
  );
  
  !isLoaded?<div className="text-warning loading-circle text-center lead">{Loading}</div>: <Map />;

  const closeMap = () =>{
    return !isLoaded;
  }
  
  function Map() {
    // const center = useMemo(() => ({ lat: lat, lng: long }), []);
    return (
        <GoogleMap zoom={10} center={center} mapContainerClassName="map-container bg-danger">
          <div className="w-100 close-map-box">
            <i className="bi bi-x-octagon-fill close-btn text-primary" onClick={closeMap}></i>
          </div>
          <Marker
          //  position={{ lat: lat, lng: long }}
           />
        </GoogleMap>
      );
}
// return <Map />
}

   