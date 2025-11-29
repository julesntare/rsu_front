import { FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const options = [
  { value: "classroom", label: "Classroom" },
  { value: "laboratory", label: "Laboratory" },
  { value: "hall", label: "Hall" },
];

const BasicRequirements = ({ bookingData, setBookingData, room }) => {
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_RSU_API_URL}/roomType/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("rsuToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRoomTypes(data);
      });
  }, []);

  return (
    <>
      <FormControl style={{ width: "100%", zIndex: 9 }}>
        <Select
          options={
            roomTypes.length > 0 &&
            roomTypes.map((roomType) => {
              return { value: roomType._id, label: roomType.room_type_name };
            })
          }
          value={bookingData.roomCategory}
          error={bookingData.error && !bookingData.roomCategory}
          helperText={
            bookingData.error && !bookingData.roomCategory ? "Required" : ""
          }
          onChange={(selectedOption) =>
            setBookingData({ ...bookingData, roomCategory: selectedOption })
          }
          placeholder="Select room category"
          isSearchable
        />
      </FormControl>
      <TextField
        type="number"
        label="Activity Estimated Participants"
        id="activity-participants"
        value={bookingData.activityParticipants || ""}
        onChange={(event) =>
          setBookingData({
            ...bookingData,
            activityParticipants: event.target.value,
          })
        }
        error={bookingData.error && !bookingData.activityParticipants}
        helperText={
          bookingData.error && !bookingData.activityParticipants
            ? "Required"
            : ""
        }
        style={{ width: "100%", marginTop: "20px" }}
      />
    </>
  );
};

export default BasicRequirements;
