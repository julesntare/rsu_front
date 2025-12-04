import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Select from "react-select";
import { WithContext as ReactTags } from "react-tag-input";
import RecommendedRooms from "./RecommendedRooms";

const recurrenceOptions = [
  { value: "once", label: "Once" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "certain_days", label: "Certain Days" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const suggestions = DAYS.map((day) => ({
  id: day,
  text: day,
}));

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const separators = [KeyCodes.comma, KeyCodes.enter];

const SchedulesDetails = ({
  bookingData,
  setBookingData,
  rooms,
  handleNext,
  handlePrevious,
  isTransitioning,
  isLoading,
}) => {
  const [tags, setTags] = useState(bookingData.activityDays || []);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleDelete = (i) => {
    const newTags = tags.filter((tag, index) => index !== i);
    setTags(newTags);
    setBookingData({
      ...bookingData,
      activityDays: newTags,
    });
  };

  const handleAddition = (tag) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    setBookingData({
      ...bookingData,
      activityDays: newTags,
    });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
    setBookingData({
      ...bookingData,
      activityDays: newTags,
    });
  };

  const handleAddTimeSlot = () => {
    if (startTime && endTime && startTime < endTime) {
      const newTimeSlots = [...(bookingData.activityTime || []), [startTime, endTime]];
      setBookingData({
        ...bookingData,
        activityTime: newTimeSlots,
      });
      // Reset to default
      setStartTime("08:00");
      setEndTime("17:00");
    } else {
      alert("Please select valid start and end times (start must be before end)");
    }
  };

  const handleRemoveTimeSlot = (index) => {
    const newTimeSlots = bookingData.activityTime.filter((_, i) => i !== index);
    setBookingData({
      ...bookingData,
      activityTime: newTimeSlots.length > 0 ? newTimeSlots : [["08:00", "17:00"]],
    });
  };

  // Calculate end date based on recurrence
  const handleRecurrenceChange = (selectedOption) => {
    const startDate = bookingData.startingDate ? new Date(bookingData.startingDate) : new Date();
    let endDate = bookingData.startingDate;

    switch (selectedOption.value) {
      case "once":
        endDate = bookingData.startingDate;
        break;
      case "weekly": {
        const weeklyEnd = new Date(startDate);
        weeklyEnd.setDate(weeklyEnd.getDate() + 7);
        endDate = weeklyEnd.toISOString().split("T")[0];
        break;
      }
      case "monthly": {
        const monthlyEnd = new Date(startDate);
        monthlyEnd.setMonth(monthlyEnd.getMonth() + 1);
        endDate = monthlyEnd.toISOString().split("T")[0];
        break;
      }
      case "certain_days":
        // User will specify end date manually
        endDate = bookingData.endingDate || bookingData.startingDate;
        break;
      default:
        endDate = bookingData.startingDate;
    }

    setBookingData({
      ...bookingData,
      recurrence: selectedOption,
      endingDate: endDate,
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between" style={{ gap: "20px" }}>
        {/* Left Column - Schedule Fields */}
        <div className="col-md-6" style={{ paddingLeft: 0 }}>
          {/* Starting Date */}
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
              Expected Starting Date <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <TextField
              id="starting_date"
              type="date"
              value={bookingData.startingDate}
              InputProps={{
                inputProps: {
                  min: new Date().toISOString().split("T")[0],
                },
              }}
              onChange={(e) => {
                const newStartDate = e.target.value;
                setBookingData({
                  ...bookingData,
                  startingDate: newStartDate,
                  endingDate: bookingData.recurrence?.value === "once" ? newStartDate : bookingData.endingDate,
                });
              }}
              error={bookingData.error && !bookingData.startingDate}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: "42px",
                  height: "42px",
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
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                    "& fieldset": {
                      borderColor: "#667eea",
                      borderWidth: "2px",
                    },
                  },
                  "& fieldset": {
                    borderColor:
                      bookingData.error && !bookingData.startingDate
                        ? "#e53e3e"
                        : "#e2e8f0",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                  padding: "8px 12px",
                  height: "auto",
                },
              }}
            />
            {bookingData.error && !bookingData.startingDate && (
              <p
                style={{
                  color: "#e53e3e",
                  marginTop: "4px",
                  fontSize: "13px",
                  marginBottom: 0,
                }}
              >
                Please select a starting date
              </p>
            )}
          </div>

          {/* Event Recurrence */}
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
              Event Recurrence <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <Select
              options={recurrenceOptions}
              value={bookingData.recurrence}
              onChange={handleRecurrenceChange}
              placeholder="Select event recurrence"
              isSearchable
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "42px",
                  borderRadius: "10px",
                  border:
                    bookingData.error && !bookingData.recurrence
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
                      bookingData.error && !bookingData.recurrence
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
          </div>

          {/* Ending Date - shown for recurring events */}
          {bookingData.recurrence?.value !== "once" && (
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
                Ending Date
              </label>
              <TextField
                id="ending_date"
                type="date"
                value={bookingData.endingDate}
                InputProps={{
                  inputProps: {
                    min: bookingData.startingDate || new Date().toISOString().split("T")[0],
                  },
                }}
                onChange={(e) => {
                  setBookingData({
                    ...bookingData,
                    endingDate: e.target.value,
                  });
                }}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    minHeight: "42px",
                    height: "42px",
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
                      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
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
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    padding: "8px 12px",
                    height: "auto",
                  },
                }}
              />
            </div>
          )}

          {/* Day Selection for recurring events */}
          {bookingData.recurrence?.value !== "once" && (
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  marginBottom: "8px",
                  display: "block",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#2d3748",
                }}
              >
                Select Days {bookingData.recurrence?.value !== "once" && <span style={{ color: "#e53e3e" }}>*</span>}
              </label>
              <ReactTags
                tags={tags}
                suggestions={suggestions}
                separators={separators}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                inputFieldPosition="bottom"
                autocomplete
                placeholder="Type day names (e.g., Monday, Tuesday...)"
                classNames={{
                  tags: "ReactTags__tags",
                  tagInput: "ReactTags__tagInput",
                  tagInputField: "ReactTags__tagInputField",
                  selected: "ReactTags__selected",
                  tag: "ReactTags__tag",
                  remove: "ReactTags__remove",
                  suggestions: "ReactTags__suggestions",
                  activeSuggestion: "ReactTags__activeSuggestion",
                }}
              />
              {bookingData.error && bookingData.recurrence?.value !== "once" && tags.length === 0 && (
                <p
                  style={{
                    color: "#e53e3e",
                    marginTop: "4px",
                    fontSize: "13px",
                    marginBottom: 0,
                  }}
                >
                  Please select at least one day for recurring bookings
                </p>
              )}
            </div>
          )}

          {/* Time Slots */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                marginBottom: "8px",
                display: "block",
                fontWeight: "600",
                fontSize: "13px",
                color: "#2d3748",
              }}
            >
              Time Slots <span style={{ color: "#e53e3e" }}>*</span>
            </label>

            {/* Current Time Slots */}
            <div style={{ marginBottom: "12px" }}>
              {bookingData.activityTime && bookingData.activityTime.length > 0 ? (
                bookingData.activityTime.map((slot, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      backgroundColor: "#f7fafc",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "#2d3748" }}>
                      {slot[0]} - {slot[1]}
                    </span>
                    <button
                      onClick={() => handleRemoveTimeSlot(index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e53e3e",
                        cursor: "pointer",
                        fontSize: "18px",
                        padding: "0 8px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "13px", color: "#718096", fontStyle: "italic" }}>
                  No time slots added yet
                </p>
              )}
            </div>

            {/* Add Time Slot */}
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", color: "#718096", marginBottom: "4px", display: "block" }}>
                  Start Time
                </label>
                <TextField
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f7fafc",
                      fontSize: "14px",
                    },
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", color: "#718096", marginBottom: "4px", display: "block" }}>
                  End Time
                </label>
                <TextField
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f7fafc",
                      fontSize: "14px",
                    },
                  }}
                />
              </div>
              <Button
                onClick={handleAddTimeSlot}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: "auto",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "13px",
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {bookingData.error && bookingData.errorMessage && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#fee",
                borderRadius: "8px",
                marginBottom: "16px",
                border: "1px solid #fcc",
              }}
            >
              <p style={{ color: "#c53030", fontSize: "13px", margin: 0 }}>
                {bookingData.errorMessage}
              </p>
            </div>
          )}

          {/* Room selection warning */}
          {!bookingData.selectedRoom && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#fffaf0",
                borderRadius: "8px",
                marginBottom: "16px",
                border: "1px solid #f6ad55",
              }}
            >
              <p style={{ color: "#c05621", fontSize: "13px", margin: 0 }}>
                ⚠️ Please select a room from the recommended list to proceed
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              onClick={handlePrevious}
              type="button"
              variant="contained"
              color="secondary"
              disabled={isTransitioning || isLoading}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              type="button"
              variant="contained"
              color="primary"
              disabled={isTransitioning || isLoading || !bookingData.selectedRoom}
              startIcon={
                (isTransitioning || isLoading) && <span className="button-spinner"></span>
              }
              sx={{
                opacity: !bookingData.selectedRoom ? 0.5 : 1,
                cursor: !bookingData.selectedRoom ? "not-allowed" : "pointer",
              }}
            >
              {isTransitioning || isLoading ? "Submitting..." : "Finish"}
            </Button>
          </div>
        </div>

        {/* Right Column - Recommended Rooms */}
        <div className="col-md-5 border-start" style={{ paddingLeft: "20px" }}>
          <RecommendedRooms
            bookingData={bookingData}
            setBookingData={setBookingData}
            rooms={rooms}
          />
        </div>
      </div>
    </>
  );
};

export default SchedulesDetails;
