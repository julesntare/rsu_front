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
    fetch(`${import.meta.env.VITE_RSU_API_URL}/roomType/all`, {
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
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            marginBottom: "6px",
            display: "block",
            fontWeight: "600",
            fontSize: "13px",
            color: "#2d3748",
          }}
        >
          Room Category <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <Select
          options={
            roomTypes.length > 0 &&
            roomTypes.map((roomType) => {
              return { value: roomType._id, label: roomType.room_type_name };
            })
          }
          value={bookingData.roomCategory}
          onChange={(selectedOption) =>
            setBookingData({ ...bookingData, roomCategory: selectedOption })
          }
          placeholder="Select room category"
          isSearchable
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: "42px",
              borderRadius: "10px",
              border:
                bookingData.error && !bookingData.roomCategory
                  ? "2px solid #e53e3e"
                  : state.isFocused
                  ? "2px solid #667eea"
                  : "2px solid #e2e8f0",
              padding: "2px 4px",
              fontSize: "14px",
              backgroundColor: state.isFocused ? "white" : "#f7fafc",
              boxShadow: state.isFocused
                ? "0 0 0 3px rgba(102, 126, 234, 0.1)"
                : "none",
              "&:hover": {
                backgroundColor: "#edf2f7",
                borderColor:
                  bookingData.error && !bookingData.roomCategory
                    ? "#e53e3e"
                    : "#cbd5e0",
              },
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "#667eea"
                : state.isFocused
                ? "#edf2f7"
                : "white",
              color: state.isSelected ? "white" : "#2d3748",
              padding: "10px 12px",
              fontSize: "14px",
              cursor: "pointer",
              "&:active": {
                backgroundColor: "#667eea",
              },
            }),
            menu: (base) => ({
              ...base,
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
            }),
          }}
        />
        {bookingData.error && !bookingData.roomCategory && (
          <p
            style={{
              color: "#e53e3e",
              marginTop: "4px",
              fontSize: "13px",
              marginBottom: 0,
            }}
          >
            Please select a room category
          </p>
        )}
      </div>

      <TextField
        type="number"
        label={
          <span>
            Estimated Participants <span style={{ color: "#e53e3e" }}>*</span>
          </span>
        }
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
            ? "Please enter the number of participants"
            : "Enter the expected number of people attending"
        }
        fullWidth
        size="small"
        margin="dense"
        inputProps={{ min: 1 }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#f7fafc",
            transition: "all 0.3s ease",
            fontSize: "14px",
            "&:hover": {
              backgroundColor: "#edf2f7",
              "& fieldset": {
                borderColor: "#cbd5e0",
              },
            },
            "&.Mui-focused": {
              backgroundColor: "white",
              "& fieldset": {
                borderColor: "#667eea",
                borderWidth: "2px",
              },
            },
            "& fieldset": {
              borderColor: "#e2e8f0",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#718096",
            fontWeight: 500,
            fontSize: "14px",
            "&.Mui-focused": {
              color: "#667eea",
              fontWeight: 600,
            },
          },
          "& .MuiInputBase-input": {
            fontSize: "14px",
          },
        }}
      />
    </>
  );
};

export default BasicRequirements;
