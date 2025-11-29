import { FormControl, Grid, TextField } from "@mui/material";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getRoom } from "../../../../redux/actions/RoomActions";
import RecommendedRooms from "./RecommendedRooms";

const options = [
  { value: "once", label: "Once" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "certain_days", label: "Certain Days" },
];

const SchedulesDetails = ({ bookingData, setBookingData }) => {
  const [selectedDate, setSelectedDate] = useState();
  const rooms = useSelector((state) => state.rooms);
  const dispatch = useDispatch();

  let footer = <p>Please pick a day</p>;
  if (selectedDate) {
    footer = <b>You picked: {format(selectedDate, "PP")}.</b>;
  }

  useEffect(() => {
    dispatch(getRoom());
  }, [dispatch]);

  return (
    <div className="d-flex justify-content-between">
      <div className="col-md-5">
        <label>
          <b>Expected Starting Date:</b>
        </label>
        <TextField
          id="starting_date"
          type="date"
          value={bookingData.starting_date}
          defaultValue={new Date()}
          InputProps={{
            inputProps: {
              min: new Date().toISOString().split("T")[0],
            },
          }}
          onChange={(e) => {
            setBookingData({
              ...bookingData,
              starting_date: e.target.value,
            });
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={bookingData.error && !bookingData.starting_date}
          helperText={
            bookingData.error && !bookingData.starting_date ? "Required" : ""
          }
          style={{ width: "100%", marginTop: "20px" }}
        />

        <FormControl style={{ width: "100%", marginRight: "50px", zIndex: 9 }}>
          <label className="mt-3">
            <b>Event Recurrence:</b>
          </label>
          <Select
            options={options}
            value={bookingData.recurrence || options[0]}
            error={bookingData.error && !bookingData.recurrence}
            helperText={
              bookingData.error && !bookingData.recurrence ? "Required" : ""
            }
            onChange={(selectedOption) =>
              setBookingData({ ...bookingData, recurrence: selectedOption })
            }
            placeholder="Select event recurrence"
            isSearchable
          />
        </FormControl>
      </div>
      <div className="col-md-5 border-start">
        <RecommendedRooms rooms={rooms} />
      </div>
    </div>
  );
};

export default SchedulesDetails;
