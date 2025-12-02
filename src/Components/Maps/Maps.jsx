import { useEffect, useRef, useState, useCallback } from "react";
import "./BuildingGoogleMap.scss";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import { distance as turf } from "@turf/turf";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getBuilding } from "../../redux/actions/BuildingActions";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

export default function Maps() {
  const [active, setActive] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const buildings = useSelector((state) => state.buildings);
  const dispatch = useDispatch();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const layersRef = useRef([]);
  const activePopupRef = useRef(null);

  // Fetch buildings on mount
  useEffect(() => {
    dispatch(getBuilding());
  }, [dispatch]);

  const displayInstructions = (route) => {
    const instructions = document.getElementById("instructions");
    if (!instructions) return;

    const steps = route.legs[0].steps;

    let html = `<p><strong>Trip duration: ${Math.floor(
      route.duration / 60
    )} min 🚴</strong></p><ol>`;
    steps.forEach((step) => {
      html += `<li>${step.maneuver.instruction}</li>`;
    });
    html += "</ol>";

    instructions.innerHTML = html;
    setShowInstructions(true);
  };

  const getRoute = async (destination) => {
    if (!userLocation) return;

    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${userLocation[0]},${userLocation[1]};${destination[0]},${destination[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();

      if (!json.routes || json.routes.length === 0) return;

      const route = json.routes[0];
      const geojson = {
        type: "Feature",
        geometry: route.geometry,
      };

      // Remove existing route
      if (map.current.getSource("route")) {
        map.current.getSource("route").setData(geojson);
      } else {
        map.current.addSource("route", {
          type: "geojson",
          data: geojson,
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
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

      // Add destination marker
      if (map.current.getLayer("destination")) {
        map.current.getSource("destination").setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: destination,
          },
        });
      } else {
        map.current.addSource("destination", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: destination,
            },
          },
        });

        map.current.addLayer({
          id: "destination",
          type: "circle",
          source: "destination",
          paint: {
            "circle-radius": 10,
            "circle-color": "#B194ED",
          },
        });
      }

      // Show instructions
      displayInstructions(route);
    } catch (error) {
      console.error("Error getting route:", error);
    }
  };

  const handleMapClick = (e) => {
    if (!map.current || !userLocation) return;

    const clickedCoords = [e.lngLat.lng, e.lngLat.lat];

    // Get directions to clicked point
    getRoute(clickedCoords);
  };

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [30.06323, -1.95877],
      zoom: 15,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Add controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      "top-right"
    );

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          setUserLocation(coords);

          map.current.flyTo({
            center: coords,
            zoom: 15,
            essential: true,
          });

          // Add user location marker
          new mapboxgl.Marker({ color: "#3887be" })
            .setLngLat(coords)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                "<p>Your current location</p>"
              )
            )
            .addTo(map.current);
        },
        () => {
          setShowLocationModal(true);
        }
      );
    }

    // Add map click listener
    map.current.on("click", (e) => {
      handleMapClick(e);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBuildingMarkers = useCallback(() => {
    if (!map.current || !map.current.loaded()) return;

    // Clear existing markers and layers
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        console.warn("Error removing marker:", e);
      }
    });
    markersRef.current = [];

    layersRef.current.forEach((layerId) => {
      try {
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
        if (map.current.getSource(layerId)) {
          map.current.removeSource(layerId);
        }
      } catch (e) {
        console.warn(`Error removing layer ${layerId}:`, e);
      }
    });
    layersRef.current = [];

    buildings.forEach((building, index) => {
      if (!building.coordinates || building.coordinates.length !== 2) {
        console.warn(`Invalid coordinates for ${building.building_name}`);
        return;
      }

      const coords = [building.coordinates[1], building.coordinates[0]];
      const glowLayerId = `building-glow-${index}`;
      const markerLayerId = `building-marker-${index}`;

      try {
        // Add glow layer
        if (!map.current.getSource(glowLayerId)) {
          map.current.addSource(glowLayerId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coords,
              },
            },
          });

          map.current.addLayer({
            id: glowLayerId,
            type: "circle",
            source: glowLayerId,
            paint: {
              "circle-radius": 16,
              "circle-color": "#f30",
              "circle-opacity": 0.2,
              "circle-blur": 0.5,
            },
          });

          layersRef.current.push(glowLayerId);
        }

        // Add main marker layer
        if (!map.current.getSource(markerLayerId)) {
          map.current.addSource(markerLayerId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coords,
              },
            },
          });

          map.current.addLayer({
            id: markerLayerId,
            type: "circle",
            source: markerLayerId,
            paint: {
              "circle-radius": 10,
              "circle-color": "#f30",
              "circle-stroke-width": 3,
              "circle-stroke-color": "#fff",
            },
          });

          layersRef.current.push(markerLayerId);
        }

        // Add label marker
        const el = document.createElement("div");
        el.className = "building-marker-label";
        el.textContent = building.building_name;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: "300px",
        }).setHTML(`
          <div class="building-popup">
            <h4>${building.building_name}</h4>
            <p>${
              building.building_description || "No description available"
            }</p>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(map.current);

        // Close other popups when this one opens
        marker.getElement().addEventListener("click", () => {
          // Close active standalone popup
          if (activePopupRef.current) {
            activePopupRef.current.remove();
            activePopupRef.current = null;
          }

          // Close all other marker popups
          markersRef.current.forEach((m) => {
            if (m !== marker) {
              const p = m.getPopup();
              if (p && p.isOpen()) {
                p.remove();
              }
            }
          });
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error(
          `Error adding marker for ${building.building_name}:`,
          error
        );
      }
    });
  }, [buildings]);

  // Add building markers when buildings load
  useEffect(() => {
    if (!map.current || buildings.length === 0) return;

    const addMarkers = () => {
      if (map.current && map.current.loaded()) {
        addBuildingMarkers();
      }
    };

    // Wait for map to be ready
    if (map.current.loaded()) {
      addBuildingMarkers();
    } else {
      map.current.once("load", addMarkers);
    }

    return () => {
      if (map.current) {
        map.current.off("load", addMarkers);
      }
    };
  }, [buildings, addBuildingMarkers]);

  const showBuildingInfo = (building) => {
    // Close any existing popup
    if (activePopupRef.current) {
      activePopupRef.current.remove();
    }

    // Close all marker popups
    markersRef.current.forEach((marker) => {
      const popup = marker.getPopup();
      if (popup && popup.isOpen()) {
        popup.remove();
      }
    });

    const coords = [building.coordinates[1], building.coordinates[0]];
    const popup = new mapboxgl.Popup({ closeButton: true, closeOnClick: false })
      .setLngLat(coords)
      .setHTML(
        `
        <div class="building-popup">
          <h4>${building.building_name}</h4>
          <p>${building.building_description || "No description available"}</p>
        </div>
      `
      )
      .addTo(map.current);

    // Store reference to active popup
    activePopupRef.current = popup;

    // Clear reference when popup is closed
    popup.on("close", () => {
      activePopupRef.current = null;
    });
  };

  const handleBuildingClick = (building, index) => {
    if (!map.current) return;

    setActive(index);
    const coords = [building.coordinates[1], building.coordinates[0]];

    // Close all open marker popups
    markersRef.current.forEach((marker) => {
      const popup = marker.getPopup();
      if (popup && popup.isOpen()) {
        popup.remove();
      }
    });

    // Fly to building
    map.current.flyTo({
      center: coords,
      zoom: 16,
      essential: true,
    });

    // Show popup after fly animation
    setTimeout(() => {
      showBuildingInfo(building);
    }, 500);

    // Get route if user location exists
    if (userLocation) {
      getRoute(coords);
    }
  };

  const filteredBuildings = buildings.filter((building) =>
    building.building_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid map mt-4 mb-5">
      <h3 className="h2 my-4 text-dark titles-buildings fw-bold w-100 text-center">
        CST Map
      </h3>

      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 buildings-box">
          <p className="fw-bold my-3">All CST Buildings</p>

          <div className="search-box mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ul className="list-group w-100 m-0 p-0 box">
            {filteredBuildings.map((building, i) => {
              const originalIndex = buildings.indexOf(building);
              return (
                <li
                  key={i}
                  className={`list-group-item ${
                    active === originalIndex ? "active" : ""
                  }`}
                  onClick={() => handleBuildingClick(building, originalIndex)}
                >
                  {building.building_name}
                </li>
              );
            })}
          </ul>

          {filteredBuildings.length === 0 && (
            <p className="text-center text-muted mt-3">No buildings found</p>
          )}
        </div>

        <div className="col-12 col-md-9 col-lg-10 map-box">
          {!mapLoaded && (
            <div className="map-loading-overlay">
              <div className="skeleton-loader">
                <div className="skeleton-pulse skeleton-map"></div>
              </div>
            </div>
          )}

          <div ref={mapContainer} className="map-container" />

          {showInstructions && (
            <div className="instructions-wrapper">
              <div id="instructions" className="instructions">
                <button
                  className="close-instructions"
                  onClick={() => setShowInstructions(false)}
                  aria-label="Close instructions"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          )}

          {mapLoaded && (
            <div className="map-info-panel">
              <div className="info-item">
                <i className="bi bi-geo-alt-fill"></i>
                <span>Click on map to get directions</span>
              </div>
              <div className="info-item">
                <i className="bi bi-building"></i>
                <span>{buildings.length} Buildings</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showLocationModal}
        onHide={() => setShowLocationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Location Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Enable location access to get directions and see your position on
            the map. You can still view buildings without location access.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLocationModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
