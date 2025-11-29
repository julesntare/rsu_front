import React, { useEffect, useState } from "react";
import "./Buildings.scss";
import BuildingGoogleMap from "../Maps/BuildingGoogleMap";
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
    dispatch(getBuilding());
  }, [dispatch]);

  return (
    <div className="mt-5 container-fluid" id="building-container">
      <h3 className="h2 my-4 text-dark titles-buildings fw-bold w-100 text-center">
        {" "}
        Buildings
      </h3>
      <hr />
      <div className="my-2 bg-none buildings-box pt-3 row mt-2">
        {buildings ? (
          buildings.map((item, i) => {
            return (
              <div
                className="card border building-card m-1 mt-3 p-0 col-12 col-md-4 col-lg-3"
                key={item._id}
              >
                <img
                  className="card-img-top m-0 pb-3"
                  src={item.img_url || defaultImg}
                  alt="building image"
                ></img>
                <h6 className="text-center card-name-title my-2">
                  {" "}
                  {item.building_name.toUpperCase()}
                </h6>
                <p className="mx-2">
                  <i>{item.building_description}</i>
                </p>
                <div className="card-body p-2">
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
                  <div className="py-1 d-flex flex-column justify-content-center btn-box">
                    {item.no_of_rooms > 0 && (
                      <button
                        className=" d-flex justify-content-center bg-primary text-white fw-bold btn-sm align-items-center rounded-pill py-2"
                        onClick={() => handleBuildingClick(item._id)}
                      >
                        <i className="bi fw-bold bi-eye me-3"></i>Head to Rooms
                      </button>
                    )}
                    <Link
                      to={`/maps/${item.coordinates.join("&")}`}
                      className="my-2 bg-primary d-flex justify-content-center text-decoration-none text-white fw-bold btn-sm align-items-center rounded-pill py-2"
                      id={i}
                      onClick={() => showBuildingLocation(item)}
                    >
                      <i className="bi bi-geo-alt me-3"> </i>Navigate on Map
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
