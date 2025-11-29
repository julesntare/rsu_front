import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

const MapWithDirections = (props) => {
  const { origin, destination } = props;
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const getDirections = async () => {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=YOUR_API_KEY`);
      const data = await response.json();
      const directions = data.routes[0].legs[0];
      setDirections(directions);
    };
    getDirections();
  }, [origin, destination]);

  return (
    <GoogleMap
      mapContainerStyle={{
        height: '400px',
        width: '800px'
      }}
      center={origin}
      zoom={7}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default MapWithDirections;
