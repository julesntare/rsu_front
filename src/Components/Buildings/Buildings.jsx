import React, { useEffect, useState } from "react";
import "./Buildings.scss";
import BuildingGoogleMap from "../Maps/BuildingGoogleMap";
import BuildingCardSkeleton from "./BuildingCardSkeleton";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBuilding } from "../../redux/actions/BuildingActions";

const Buildings = () => {
  // Fetch buildings from redux store
  const buildings = useSelector((state) => state.buildings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [locationMarker, setLocationMarker] = useState(false);
  const [latLong, setLatLong] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const showBuildingLocation = (item) => {
    setLocationMarker(true);
    setLatLong({
      lat: item.location.lat,
      long: item.location.long,
    });
  };
  const defaultImg =
    "https://res.cloudinary.com/julesntare/image/upload/v1673265264/rsu_cst_buildings/undraw_apartment_rent_o0ut_sj75zz.png";

  const handleBuildingClick = (roomId) => {
    navigate(`/allrooms/${roomId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getBuilding());
      // Add minimum delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="mt-5 container-fluid" id="building-container">
      <h3 className="h2 my-4 text-dark titles-buildings fw-bold w-100 text-center">
        {" "}
        Buildings
      </h3>
      <hr />
      <div className="my-2 bg-none buildings-box pt-3 row mt-2">
        {isLoading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 6 }).map((_, index) => (
            <BuildingCardSkeleton key={index} />
          ))
        ) : buildings && buildings.length > 0 ? (
          buildings.map((item, i) => {
            return (
              <div
                className="card border building-card m-1 mt-3 p-0 col-12 col-md-4 col-lg-3 d-flex flex-column"
                key={item._id}
              >
                <img
                  className="card-img-top m-0 pb-3"
                  src={item.img_url || defaultImg}
                  alt="building image"
                ></img>
                <div className="d-flex justify-content-center align-items-center my-2">
                  <h6 className="text-center card-name-title mb-0">
                    {item.building_name.toUpperCase()}
                  </h6>
                  <div className="info-icon-wrapper ms-2">
                    <i className="bi bi-info-circle info-icon"></i>
                    <span className="custom-tooltip">
                      {item.building_description}
                    </span>
                  </div>
                </div>
                <div className="card-body p-2 pb-3">
                  <div className="w-100 d-flex justify-content-evenly text-dark pb-3">
                    <span className="d-flex justify-content-center align-items-center me-2">
                      <i className="bi me-3 bi-buildings"></i>
                      {item.floors} Floors
                    </span>

                    <span className=" d-flex justify-content-center align-items-center me-2">
                      <i className="bi me-3 bi-door-open"></i>
                      {item.no_of_rooms} Rooms
                    </span>
                  </div>
                  <div className="w-100 d-flex flex-column justify-content-evenly text-dark pb-3">
                    <span>Nearlest Places: </span>
                    <b>
                      <i>{item.near_locations.join(", ")}</i>
                    </b>
                  </div>
                  <div className="py-1 d-flex justify-content-center gap-2 btn-box">
                    {item.no_of_rooms > 0 && (
                      <button
                        className="btn-rooms d-flex justify-content-center align-items-center flex-1"
                        onClick={() => handleBuildingClick(item._id)}
                      >
                        <i className="bi bi-eye me-2"></i>
                        <span>Rooms</span>
                      </button>
                    )}
                    <Link
                      to={`/maps/${item.coordinates.join("&")}`}
                      className="btn-map d-flex justify-content-center text-decoration-none align-items-center flex-1"
                      id={i}
                      onClick={() => showBuildingLocation(item)}
                    >
                      <i className="bi bi-geo-alt me-2"></i>
                      <span>Map</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-muted text-center mt-5">No building found</div>
        )}
      </div>
      {locationMarker && (
        <BuildingGoogleMap latLong={latLong} showMaps={setLocationMarker} />
      )}
    </div>
  );
};

export default Buildings;
