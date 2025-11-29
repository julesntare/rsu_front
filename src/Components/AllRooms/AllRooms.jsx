import React, { useEffect, useState } from "react";
import "./AllRooms.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRoom } from "../../redux/actions/RoomActions";
import useAuth from "../../hooks/useAuth";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { getOffice } from "../../redux/actions/OfficeActions";
import NumbersToOrdinalForm from "../utils/NumbersToOrdinalForm";
import NumbersToDaysForm from "../utils/NumbersToDaysForm";
import { TextField } from "@mui/material";
import { getBooking } from "../../redux/actions/BookingActions";
import { ProgressBar, Tooltip } from "react-bootstrap";

const AllRooms = (props) => {
  const [currRooms, setCurrRooms] = useState([]);
  const [currOffices, setCurrOffices] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const rooms = useSelector((state) => state.rooms.rooms);
  const offices = useSelector((state) => state.offices.offices);
  const bookings = useSelector((state) => state.bookings.bookings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasParam } = props;
  const param = useParams();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    dispatch(getRoom());
    dispatch(getOffice());
    dispatch(getBooking());
    if (hasParam) {
      setCurrRooms((currRooms) => [
        ...currRooms,
        ...rooms.filter(
          (room) => room.room_building && room.room_building._id === param.id
        ),
      ]);
      setFilteredRooms((currRooms) => [
        ...currRooms,
        ...rooms.filter(
          (room) => room.room_building && room.room_building._id === param.id
        ),
      ]);
      setCurrOffices((currOffices) => [
        ...currOffices,
        ...offices.filter(
          (office) =>
            office.office_building_location &&
            office.office_building_location._id === param.id
        ),
      ]);
      setFilteredOffices((currOffices) => [
        ...currOffices,
        ...offices.filter(
          (office) =>
            office.office_building_location &&
            office.office_building_location._id === param.id
        ),
      ]);
    } else {
      rooms.map((room) => {
        setCurrRooms((currRooms) => [...currRooms, room]);
        setFilteredRooms((currRooms) => [...currRooms, room]);
      });
      offices.map((office) => {
        setCurrOffices((currOffices) => [...currOffices, office]);
        setFilteredOffices((currOffices) => [...currOffices, office]);
      });
    }
  }, [dispatch]);

  // navigate to rooms when requestRooms clicked
  const navigateToBooking = (e, i) => {
    e.preventDefault();
    // check if user is logged in an validate token
    if (!isAuthenticated) {
      localStorage.setItem("rsu_redirect", `/bookingform/${i}`);
      navigate("/login");
      return;
    }
    navigate(`/bookingform/${i}`);
  };

  // const getProgress = (room) => {
  //   const today = new Date();
  //   const todayDay = today.getDay();
  //   const todayHour = today.getHours();
  //   const todayMinute = today.getMinutes();

  //   const bookingsToday = bookings.filter(

  const searchRooms = (e) => {
    e.preventDefault();
    let search = e.target.value;
    const filteredRooms = currRooms.filter(
      (room) =>
        room.room_name.toLowerCase().includes(search.toLowerCase()) ||
        room.room_type.room_type_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        room.capacity.toString().includes(search)
    );
    setFilteredRooms(filteredRooms);
  };

  const searchOffices = (e) => {
    e.preventDefault();
    let search = e.target.value.toLowerCase();
    const filteredOffices = currOffices.filter(
      (office) =>
        office.office_name.toLowerCase().includes(search) ||
        office.office_description.toLowerCase().includes(search) ||
        office.office_type.toLowerCase().includes(search) ||
        office.capacity.toString().includes(search)
    );
    setFilteredOffices(filteredOffices);
  };

  const roomsRender =
    currRooms.length === 0 ? (
      <div className="text-center">No rooms available at the moment</div>
    ) : (
      filteredRooms.map((room, i) => (
        <div
          className="card text-sm col-12 col-sm-4 col-lg-3 col-xxl-3 shadow-sm room-card"
          key={i}
          id={i}
        >
          <div className="card-body" id="card-body">
            <div className="time-line-box">{/* {getProgress(room)} */}</div>
            <h3 className="room-name my-1 h4 d-flex justify-content-center align-items-center w-100 card-title">
              {room.room_name}
            </h3>
            {room.room_description && (
              <div className="card-text room-location m-0  w-100">
                <p className="d-flex flex-column justify-content-center align-items-start">
                  <small className="text-sm">{room.room_description}</small>
                </p>
              </div>
            )}

            <p className="room-use">
              <span className="fw-bold">Category: </span>
              <small className="fs-sm">{room.room_type.room_type_name}</small>
            </p>
            {room.capacity && (
              <div className="label-box w-100 d-flex  flex-column">
                <div className="details-box w-100 d-flex w-100 flex-column">
                  <div className="d-flex justify-content-between">
                    <p className="room-seats">
                      <span className="fw-bold">Capacity: </span>
                      {room.capacity}
                    </p>
                    <p>
                      {room.room_status && room.room_status.value == 0 ? (
                        <button className="text-danger danger-btn fw-bold btn w-100 btn-sm btn-light">
                          <i className="bi bi-exclamation-circle"></i> Occupied
                        </button>
                      ) : (
                        <button className="text-success danger-btn fw-bold btn w-100 btn-sm btn-light">
                          <i className="bi bi-info-circle"></i> Free
                        </button>
                      )}
                    </p>
                  </div>
                  <p className="room-use">
                    <span className="fw-bold">Room Floor: </span>
                    <small className="fs-sm">{room.room_floor}</small>
                  </p>
                </div>
                <div className="status-btns d-flex justify-content-center aligh-items-center p-2">
                  <div
                    to="/bookingform"
                    className="nav-link d-flex flex-column w-100"
                  >
                    <Link
                      onClickCapture={(e) => navigateToBooking(e, room._id)}
                      className="text-info w-100 booking-btn fw-bold btn btn-sm text-info"
                    >
                      Request a Room
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))
    );

  const officesRender =
    currOffices.length === 0 ? (
      <div className="text-center">No offices available at the moment</div>
    ) : (
      filteredOffices.map((office, i) => (
        <div
          className="card text-sm col-12 col-sm-4 col-lg-3 col-xxl-3 shadow-sm room-card"
          key={i}
          id={i}
        >
          <div className="card-body" id="card-body">
            <h3 className="room-name my-1 h4 d-flex justify-content-center align-items-center w-100 card-title">
              {office.office_name}
            </h3>
            {office.office_description && (
              <div className="card-text room-location m-0  w-100">
                <p className="d-flex flex-column justify-content-center align-items-start">
                  <small className="text-sm">{office.office_description}</small>
                </p>
              </div>
            )}

            <p className="room-use">
              <span className="fw-bold">Building: </span>
              <small className="fs-sm">
                {office.office_building_location.building_name}
              </small>
            </p>

            <p className="room-use">
              <small className="fs-sm">
                {office.building_floor == 0
                  ? "Ground"
                  : NumbersToOrdinalForm(office.building_floor)}{" "}
                Floor
              </small>
            </p>
            <div className="label-box w-100 d-flex  flex-column">
              <div className="details-box w-100 d-flex w-100 flex-column">
                <div className="d-flex justify-content-between">
                  <p className="room-seats">
                    <span className="fw-bold">Category: </span>
                    {office.office_type}
                  </p>
                </div>
                <p className="room-use">
                  <span className="fw-bold">Office Head: </span>
                  <small className="fs-sm">{office.responsible.fullname}</small>
                </p>
                {/* add schedules in badges labels */}
                <div className="d-flex justify-content-between">
                  <p className="room-seats">
                    <span className="fw-bold">Schedules: </span>
                    {office.schedules.map((schedule, i) => (
                      <span
                        key={i}
                        className="badge bg-primary text-dark mx-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {NumbersToDaysForm(schedule[0])} {schedule[1]} -{" "}
                        {schedule[2]}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    );

  return (
    <div className="container-fluid h-100 w-100">
      <Tabs>
        <TabList>
          <Tab>
            <h3 className="h6 my-4 text-dark titles-buildings fw-bold w-100 text-center">
              {" "}
              Open Rooms
            </h3>
          </Tab>
          <Tab>
            <h3 className="h6 my-4 text-dark titles-buildings fw-bold w-100 text-center">
              {" "}
              Offices
            </h3>
          </Tab>
        </TabList>

        <TabPanel>
          <div className="d-flex row h-100" id="rooms-box">
            <div
              className="d-flex justify-content-end align-items-center"
              style={{ width: "100%" }}
            >
              <TextField
                id="standard-basic"
                label="Search & filter rooms"
                style={{ width: "200px" }}
                onChange={searchRooms}
              />
            </div>
            {roomsRender}
          </div>
        </TabPanel>
        <TabPanel>
          <div
            className="d-flex justify-content-end align-items-center"
            style={{ width: "100%" }}
          >
            <TextField
              id="standard-basic"
              label="Search & filter offices"
              style={{ width: "200px" }}
              onChange={searchOffices}
            />
          </div>
          <div className="d-flex row h-100" id="rooms-box">
            {officesRender}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default AllRooms;
