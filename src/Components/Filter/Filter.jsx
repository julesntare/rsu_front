import React, { useEffect, useRef, useState } from "react";
import "./Filter.scss";
import BuildingsList from "../../assets/APIs/BuildingsList.json";
import Select from "react-select";

export default function Filter() {
  const [searchRoom, setSearchRoom] = useState("");
  const roomNameRef = useRef();
  const roomCapacityRef = useRef();
  const dateRef = useRef();
  const hoursRangeRef = useRef();

  const handleFilterNames = (name) => {
    setSearchRoom(name);
  };
  const handleSubmit = (data) => {
    data.preventDefault();
  };
  let roomNames = [];
  let roomBySearch;
  const defaultRooms = [];
  BuildingsList.map((building) => defaultRooms.push(building.rooms));
  if (!searchRoom) {
    // flatten default rooms and map them to options
    defaultRooms.flat().map((room, i) => {
      return (roomNames.push({value:room.name, label:room.name}));
    });
  } else if (searchRoom) {
    roomBySearch = defaultRooms
      .map((room, i) =>
        room.filter((roomName) => {
          return roomName.name
            .toLowerCase()
            .includes(searchRoom.toLocaleLowerCase());
        })
      )
      .map((room) =>
        room.map((name, i) => <option key={i}>{name.name}</option>)
      );
  }

  return (
    <nav className="navbar filter mt-5  d-flex w-100 p-2 mt-3">
      <h3 className="lead bg-none fw-bold text-start m-0 filter-text">
        Filters:
      </h3>
      <form
        className="d-flex justify-content-between w-100 form"
        role="filter"
        onSubmit={handleSubmit}
      >
        <div className=" d-flex input-box  px-1 me-2 h-100 justify-content-start w-100 align-items-center">
          <label
            className="d-flex flex-column me-lg-2"
            htmlFor="roomName"
            defaultValue={"Room name"}
          >
            <div className="w-100 text-start d-flex flex-column room-name justify-content-between flex-lg-row ps-2 fw-bold">
            </div>
            <Select
              options={roomNames}
              inputId="roomName"
              ref={roomNameRef}
              onChange={(e) => handleFilterNames(e.value)}
              placeholder="Room name"
              className="selectpicker box-filter text-dark p-1 py-2 py-2 me-2"
            />
          </label>
          <label
            className="d-flex flex-column me-lg-2"
            htmlFor="roomCapacity"
          >
            <Select
            options={
              [
                {value:"300", label:"<300"},
                {value:"200", label:"<200"},
                {value:"100", label:"<100"},
                {value:"50", label:"<50"},
              ]
            }
              inputId="roomCapacity"
              ref={roomCapacityRef}
              aria-label=".form-select-sm example"
              placeholder="Room capacity"
            />
          </label>
          <label className="d-flex flex-column me-lg-2" htmlFor="date">
            <input
              id="date"
              ref={dateRef}
              className="form-control form-select-sm p-1 py-2 box-filter me-2"
              type="date"
              aria-label="time"
            />
          </label>
          <label className="d-flex flex-column me-lg-2" htmlFor="hoursRange">
          <Select
            options={
              [
                {value:"08:00 - 11:00", label:"08:00 - 11:00"},
                {value:"11:00 - 02:00", label:"11:00 - 02:00"},
                {value:"02:00 - 05:00", label:"02:00 - 05:00"},
              ]
            }
              ref={hoursRangeRef}
              id="hoursRange"
              aria-label=".form-select-sm example"
            />
          </label>
        </div>
        {/* <button className="btn-p d-flex justify-content-center px-3 py-1 align-items-center " type="submit"><i className="bi text-primary bi-search"></i></button> */}
      </form>
    </nav>
  );
}
