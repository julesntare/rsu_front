import React, { useEffect, useRef, useState } from "react";
import "./BuildingGoogleMap.scss";
import mapboxgl from "mapbox-gl";
import { distance as turf } from "@turf/turf";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getBuilding } from "../../redux/actions/BuildingActions";
import { useParams } from "react-router-dom";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

export default function Maps() {
  const param = useParams();
  const [active, setActive] = useState("");
  const [center, setCenter] = useState([30.06323, -1.95877]);
  const [otherLocations, setOtherLocations] = useState([]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const buildings = useSelector((state) => state.buildings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBuilding());
  }, [dispatch]);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center,
      zoom: zoom,
    });
    map.current.on("move", () => {
      setCenter([
        map.current.getCenter().lng.toFixed(4),
        map.current.getCenter().lat.toFixed(4),
      ]);
      setZoom(map.current.getZoom().toFixed(5));
    });

    route();
  }, [map.current, navigator.geolocation]);

  const locate = () => {
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        style: {
          right: 10,
          top: 10,
        },
        position: "bottom-left",
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );
  };

  function toPoint(lng, lat) {
    return {
      type: "Point",
      coordinates: [lng, lat],
    };
  }

  const route = async () => {
    await Promise.all(
      buildings.map(async (building) => {
        setOtherLocations([
          ...otherLocations,
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [building.coordinates[1], building.coordinates[0]],
            },
          },
        ]);
      })
    );

    locate();
    map.current.on("load", () => {
      // check if the user has given permission to access the location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocationEnabled(true);
          // Add starting point to the map
          map.current.addLayer({
            id: "point",
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Point",
                      coordinates: [
                        position.coords.longitude,
                        position.coords.latitude,
                      ],
                    },
                  },
                ],
              },
            },
            paint: {
              "circle-radius": 10,
              "circle-color": "#3887be",
            },
          });
          // re-center the map
          map.current.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom: 15,
          });
        });
      }

      // make an initial directions request that
      // starts and ends at the same location
      // getRoute(start);

      new mapboxgl.Popup()
        .setHTML("<p>This is your current location</p>")
        .setLngLat(center)
        .addTo(map.current);
    });
  };

  useEffect(() => {
    map.current.on("click", (event) => {
      // Calculate the distance between the current location and the clicked location
      const distance = turf(
        toPoint(center[0], center[1]),
        toPoint(event.lngLat.lng, event.lngLat.lat),
        {
          units: "meters",
        }
      );

      // Set a threshold distance (in meters)
      const threshold = 40; // 40 meter

      if (distance <= threshold) {
        new mapboxgl.Popup()
          .setHTML("<p>This is your current location</p>")
          .setLngLat(center)
          .addTo(map.current);
        return;
      }

      for (let i = 0; i < buildings.length; i++) {
        const distance = turf(
          toPoint(buildings[i].coordinates[1], buildings[i].coordinates[0]),
          toPoint(event.lngLat.lng, event.lngLat.lat),
          {
            units: "meters",
          }
        ).toFixed(1);

        if (distance <= threshold) {
          let distanceText =
            distance < 900 ? `${distance} meters` : `${distance / 1000} kms`;
          new mapboxgl.Popup()
            .setHTML(
              `<b>${buildings[i].building_name}</b> <hr/>
            <p>${buildings[i].building_description}</p>
            <i><b>${distanceText}</b> to reach there</i>
            `
            )
            .setLngLat([
              buildings[i].coordinates[1],
              buildings[i].coordinates[0],
            ])
            .addTo(map.current);
          break;
        }
      }

      getShortRoute(event.lngLat);
    });
  }, [buildings, center]);

  const getShortRoute = (lngLat) => {
    const coords = Object.keys(lngLat).map((key) => lngLat[key]);
    const end = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: coords,
          },
        },
      ],
    };
    if (map.current.getLayer("end")) {
      map.current.getSource("end").setData(end);
    } else {
      map.current.addLayer({
        id: "end",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: coords,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#B194ED",
        },
      });
    }
    getRoute(coords);
  };

  async function getRoute(end) {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${center[0]},${center[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: "GET" }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.current.getSource("route")) {
      map.current.getSource("route").setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.current.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }
    // get the sidebar and add the instructions
    const instructions = document.getElementById("instructions");
    const steps = data.legs[0].steps;

    let tripInstructions = "";
    for (const step of steps) {
      tripInstructions += `<li>${step.maneuver.instruction}</li>`;
    }
    instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
      data.duration / 60
    )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;
  }

  // request user location enabling
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.longitude, position.coords.latitude]);

          setLocationEnabled(true);
          return;
        },
        (error) => {
          setLocationEnabled(false);
        }
      );
    } else {
      alert("Better to enable your location for best way to follow.");
    }
  }, [navigator.geolocation]);

  const handleBuildingClick = (building, id) => {
    setActive(id);
    // convert the building location to a lngLat and assign them to getShortRoute function
    const lngLat = {
      lng: building.coordinates[1],
      lat: building.coordinates[0],
    };

    getShortRoute(lngLat);
  };

  useEffect(() => {
    // add other building for each other locations
    buildings.map(async (location, index) => {
      await map.current.addLayer({
        id: `point${index}`,
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: [
                    location.coordinates[1],
                    location.coordinates[0],
                  ],
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#f30",
        },
      });

      // new mapboxgl.Popup()
      //   .setHTML("<p><b>" + location.building_name + "</b></p><br/>")
      //   .setLngLat([location.coordinates[1], location.coordinates[0]])
      //   .addTo(map.current);
    });
  }, [buildings]);

  const buildingsList =
    buildings &&
    buildings.map((building, i) => (
      <li
        key={i}
        className={active === i ? "active list-group-item" : " list-group-item"}
        onClick={() => handleBuildingClick(building, i)}
      >
        {building.building_name}
      </li>
    ));

  return (
    <div className=" container-fluid map  mt-4 mb-5">
      <h3 className="h2 my-4 text-dark titles-buildings fw-bold w-100 text-center">
        {" "}
        CST Map
      </h3>
      <div className="row ">
        <div className="col-2 col-md-3 bg-light buildings-box">
          <p className="fw-bold my-3">All CST Buildings</p>
          <ul className="list-group w-100 m-0 p-0 box">{buildingsList}</ul>
        </div>
        <div className="col-10 col-md-9 map-box">
          <div ref={mapContainer} className="map-container" />
          <div id="instructions" className="instructions"></div>
        </div>
        {/* popup a react-bootstrap modal when locationEnabled state in false */}
        <Modal show={false} onHide={() => setLocationEnabled(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Location</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              You need to enable your location to get the best way to follow.
              Enable it and refresh the page.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Enable
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
