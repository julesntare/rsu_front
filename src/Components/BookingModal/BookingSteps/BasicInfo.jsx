import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import Select from "react-select";
import { WithContext as ReactTags } from "react-tag-input";
import "./Booking.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const suggestions = DAYS.map((day) => {
  return {
    id: day,
    text: day,
  };
});

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const separators = [KeyCodes.comma, KeyCodes.enter];

const options = [
  { value: "learning", label: "Learning" },
  { value: "meetup", label: "Meetup" },
  { value: "praying", label: "Praying" },
  { value: "publicTalks", label: "Public Talks" },
  { value: "practices", label: "Practices" },
  { value: "others", label: "Others" },
];

const recurrence_options = [
  { value: "once", label: "Once" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "certain_days", label: "Certain Days" },
];

const BasicInfo = ({
  bookingData,
  setBookingData,
  room,
  hasParam,
  modules,
  handleNext,
  isTransitioning,
}) => {
  const [tags, setTags] = useState([]);

  const handleDelete = (i) => {
    const newTags = tags.filter((tag, index) => index !== i);
    setTags(newTags);
    setBookingData({
      ...bookingData,
      activity_days: newTags,
    });
  };

  const handleAddition = (tag) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    setBookingData({
      ...bookingData,
      activity_days: newTags,
    });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
    setBookingData({
      ...bookingData,
      activity_days: newTags,
    });
  };

  return (
    <>
      {room && (
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              fontSize: "13px",
              color: "#718096",
              fontWeight: 500,
              display: "block",
              marginBottom: "6px",
            }}
          >
            Selected Room
          </label>
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "8px 14px",
              borderRadius: "18px",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: "0 3px 10px rgba(102, 126, 234, 0.3)",
              letterSpacing: "0.3px",
            }}
          >
            {room.room_name}
          </span>
        </div>
      )}
      {hasParam && (
        <div
          className="d-flex justify-content-between"
          style={{ gap: "16px", marginBottom: "16px" }}
        >
          <div className="col-md-6" style={{ paddingLeft: 0 }}>
            {/* add starting end ending date fields */}
            <FormControl
              style={{ width: "100%", marginBottom: "14px", zIndex: 99 }}
            >
              <label
                style={{
                  marginBottom: "6px",
                  display: "block",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#2d3748",
                }}
              >
                Event Recurrence
              </label>
              <Select
                options={recurrence_options}
                value={bookingData.recurrence || recurrence_options[0]}
                error={bookingData.error && !bookingData.recurrence}
                helperText={
                  bookingData.error && !bookingData.recurrence ? "Required" : ""
                }
                onChange={(selectedOption) => {
                  const startDate = bookingData.activityStartDate || new Date();
                  switch (selectedOption.value) {
                    case "once":
                      setBookingData({
                        ...bookingData,
                        recurrence: selectedOption,
                        activityEndDate: startDate,
                      });
                      break;
                    case "weekly": {
                      const weeklyEndDate = new Date(startDate);
                      weeklyEndDate.setDate(weeklyEndDate.getDate() + 7);
                      setBookingData({
                        ...bookingData,
                        recurrence: selectedOption,
                        activityEndDate: weeklyEndDate
                          .toISOString()
                          .slice(0, 10),
                      });
                      break;
                    }
                    case "monthly": {
                      const monthlyEndDate = new Date(startDate);
                      monthlyEndDate.setMonth(monthlyEndDate.getMonth() + 1);
                      setBookingData({
                        ...bookingData,
                        recurrence: selectedOption,
                        activityEndDate: monthlyEndDate
                          .toISOString()
                          .slice(0, 10),
                      });
                      break;
                    }
                    default:
                      setBookingData({
                        ...bookingData,
                        recurrence: selectedOption,
                        activityEndDate: startDate,
                      });
                      break;
                  }
                }}
                placeholder="Select event recurrence"
                isSearchable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "42px",
                    borderRadius: "10px",
                    border: state.isFocused
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
                      borderColor: "#cbd5e0",
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
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    overflow: "hidden",
                  }),
                }}
              />
            </FormControl>
            {/* if booking.recurrence is not once, add tag input field for days of week */}
            {bookingData.recurrence &&
              bookingData.recurrence.value !== "once" && (
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      marginBottom: "8px",
                      display: "block",
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#2d3748",
                    }}
                  >
                    Select Days
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
                  />
                </div>
              )}

            {/* Date fields in row */}
            <div
              className="d-flex"
              style={{ gap: "12px", marginBottom: "14px" }}
            >
              <div className="d-flex flex-column" style={{ flex: 1 }}>
                <label
                  style={{
                    marginBottom: "8px",
                    display: "block",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#2d3748",
                  }}
                >
                  Start Date
                </label>
                <DatePicker
                  mobileLabels={{
                    date: "Date",
                    month: "Month",
                    year: "Year",
                  }}
                  value={bookingData.activityStartDate || new Date()}
                  onChange={(e) => {
                    setBookingData({
                      ...bookingData,
                      activityStartDate: e,
                    });
                    if (bookingData.recurrence) {
                      switch (bookingData.recurrence.value) {
                        case "weekly":
                          setBookingData({
                            ...bookingData,
                            activityEndDate: new Date(
                              new Date(e).setDate(new Date(e).getDate() + 7)
                            )
                              .toISOString()
                              .slice(0, 10),
                          });
                          break;
                        case "monthly":
                          setBookingData({
                            ...bookingData,
                            activityEndDate: new Date(
                              new Date(e).setMonth(new Date(e).getMonth() + 1)
                            )
                              .toISOString()
                              .slice(0, 10),
                          });
                          break;
                        default:
                          setBookingData({
                            ...bookingData,
                            activityEndDate: e,
                          });
                          break;
                      }
                    }
                  }}
                  format="YYYY-MM-DD"
                  minDate={new Date().toISOString().slice(0, 10)}
                  style={{
                    display: "block",
                    padding: "13px 12px",
                    width: "100%",
                    borderRadius: "10px",
                    border: "2px solid #e2e8f0",
                    backgroundColor: "#f7fafc",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
              <div className="d-flex flex-column" style={{ flex: 1 }}>
                <label
                  style={{
                    marginBottom: "8px",
                    display: "block",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#2d3748",
                  }}
                >
                  End Date
                </label>
                <DatePicker
                  mobileLabels={{
                    date: "Date",
                    month: "Month",
                    year: "Year",
                  }}
                  value={bookingData.activityEndDate || new Date()}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, activityEndDate: e })
                  }
                  format="YYYY-MM-DD"
                  minDate={bookingData.activityStartDate}
                  style={{
                    display: "block",
                    padding: "13px 12px",
                    width: "100%",
                    borderRadius: "10px",
                    border: "2px solid #e2e8f0",
                    backgroundColor:
                      bookingData.recurrence &&
                      bookingData.recurrence.value === "once"
                        ? "#f0f0f0"
                        : "#f7fafc",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    cursor:
                      bookingData.recurrence &&
                      bookingData.recurrence.value === "once"
                        ? "not-allowed"
                        : "pointer",
                  }}
                  disabled={
                    bookingData.recurrence &&
                    bookingData.recurrence.value === "once"
                  }
                />
              </div>
            </div>

            {/* Activity Type */}
            <FormControl
              error={bookingData.error && !bookingData.activityType}
              style={{ width: "100%", zIndex: 9, marginBottom: "14px" }}
            >
              <label
                style={{
                  marginBottom: "6px",
                  display: "block",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#2d3748",
                }}
              >
                Activity Type <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <Select
                labelId="activity-type-label"
                id="activity-type"
                options={options}
                value={bookingData.activityType || ""}
                helperText={
                  bookingData.error && !bookingData.activityType
                    ? "Required"
                    : ""
                }
                onChange={(selectedOption) =>
                  setBookingData({
                    ...bookingData,
                    activityType: selectedOption,
                  })
                }
                placeholder="Select an activity type"
                isSearchable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "42px",
                    borderRadius: "10px",
                    border:
                      bookingData.error && !bookingData.activityType
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
                        bookingData.error && !bookingData.activityType
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
              <FormHelperText
                style={{ color: "#e53e3e", marginTop: "4px", fontSize: "13px" }}
              >
                {bookingData.error && !bookingData.activityType
                  ? "Please select an activity type"
                  : ""}
              </FormHelperText>
            </FormControl>

            {/* Activity Description */}
            <div style={{ marginBottom: "14px", position: "relative" }}>
              <TextField
                label={
                  <span>
                    Activity Description{" "}
                    <span style={{ color: "#e53e3e" }}>*</span>
                  </span>
                }
                id="activity-description"
                value={bookingData.activityDescription || ""}
                onChange={(event) =>
                  setBookingData({
                    ...bookingData,
                    activityDescription: event.target.value,
                  })
                }
                error={bookingData.error && !bookingData.activityDescription}
                helperText={
                  bookingData.error && !bookingData.activityDescription
                    ? "Please provide an activity description"
                    : "Describe the purpose and details of your booking"
                }
                fullWidth
                multiline
                rows={2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f7fafc",
                    transition: "all 0.3s ease",
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
            </div>

            {/* Continue Button */}
            {bookingData.step === 0 && handleNext && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleNext}
                  type="button"
                  variant="contained"
                  color="primary"
                  disabled={isTransitioning}
                  startIcon={
                    isTransitioning && <span className="button-spinner"></span>
                  }
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    padding: "10px 24px",
                    fontSize: "14px",
                    fontWeight: 600,
                    minHeight: "42px",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {isTransitioning ? "Loading..." : "Continue"}
                </Button>
              </div>
            )}
          </div>
          <div
            className="col-md-5"
            style={{
              paddingRight: 0,
              paddingLeft: "16px",
              borderLeft: "2px solid #e2e8f0",
            }}
          >
            <h4
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#2d3748",
                marginBottom: "10px",
              }}
            >
              Available Schedules
            </h4>
            {/* list react-bootstrap badges of available schedules */}
            <div className="d-flex flex-wrap">
              <span
                style={{
                  color: "#718096",
                  fontSize: "13px",
                  fontStyle: "italic",
                }}
              >
                No selections yet
              </span>
            </div>
          </div>
        </div>
      )}

      {!hasParam && (
        <>
          {/* Activity Type */}
          <FormControl
            error={bookingData.error && !bookingData.activityType}
            style={{ width: "100%", zIndex: 9, marginBottom: "16px" }}
          >
            <label
              style={{
                marginBottom: "6px",
                display: "block",
                fontWeight: "600",
                fontSize: "13px",
                color: "#2d3748",
              }}
            >
              Activity Type <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <Select
              labelId="activity-type-label"
              id="activity-type"
              options={options}
              value={bookingData.activityType || ""}
              helperText={
                bookingData.error && !bookingData.activityType ? "Required" : ""
              }
              onChange={(selectedOption) =>
                setBookingData({ ...bookingData, activityType: selectedOption })
              }
              placeholder="Select an activity type"
              isSearchable
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "42px",
                  borderRadius: "10px",
                  border:
                    bookingData.error && !bookingData.activityType
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
                      bookingData.error && !bookingData.activityType
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
            <FormHelperText
              style={{ color: "#e53e3e", marginTop: "4px", fontSize: "13px" }}
            >
              {bookingData.error && !bookingData.activityType
                ? "Please select an activity type"
                : ""}
            </FormHelperText>
          </FormControl>

          {/* Activity Description */}
          <div style={{ marginBottom: "14px", position: "relative" }}>
            <TextField
              label={
                <span>
                  Activity Description{" "}
                  <span style={{ color: "#e53e3e" }}>*</span>
                </span>
              }
              id="activity-description"
              value={bookingData.activityDescription || ""}
              onChange={(event) =>
                setBookingData({
                  ...bookingData,
                  activityDescription: event.target.value,
                })
              }
              error={bookingData.error && !bookingData.activityDescription}
              helperText={
                bookingData.error && !bookingData.activityDescription
                  ? "Please provide an activity description"
                  : "Describe the purpose and details of your booking"
              }
              fullWidth
              multiline
              rows={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f7fafc",
                  transition: "all 0.3s ease",
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
          </div>

          {/* Continue Button */}
          {bookingData.step === 0 && handleNext && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleNext}
                type="button"
                variant="contained"
                color="primary"
                disabled={isTransitioning}
                startIcon={
                  isTransitioning && <span className="button-spinner"></span>
                }
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  minHeight: "42px",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {isTransitioning ? "Loading..." : "Continue"}
              </Button>
            </div>
          )}
        </>
      )}

      {bookingData.activityType &&
        bookingData.activityType.value === "learning" && (
          <FormControl
            error={bookingData.error && !bookingData.activityModule}
            style={{ width: "100%", marginBottom: "16px" }}
          >
            <label
              style={{
                marginBottom: "6px",
                display: "block",
                fontWeight: "600",
                fontSize: "13px",
                color: "#2d3748",
              }}
            >
              Activity Module <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <Select
              labelId="activity-module-label"
              id="activity-module"
              options={
                modules.length > 0 &&
                modules.map((module) => {
                  return {
                    value: module._id,
                    label: module.module_name + " (" + module.module_code + ")",
                  };
                })
              }
              value={bookingData.activityModule || ""}
              helperText={
                bookingData.error && !bookingData.activityModule
                  ? "Required"
                  : ""
              }
              onChange={(selectedOption) =>
                setBookingData({
                  ...bookingData,
                  activityModule: selectedOption,
                })
              }
              placeholder="Select an activity module"
              isSearchable
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "42px",
                  borderRadius: "10px",
                  border:
                    bookingData.error && !bookingData.activityModule
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
                      bookingData.error && !bookingData.activityModule
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
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  overflow: "hidden",
                }),
              }}
            />
            <FormHelperText
              style={{ color: "#e53e3e", marginTop: "4px", fontSize: "13px" }}
            >
              {bookingData.error && !bookingData.activityModule
                ? "Please select a module"
                : ""}
            </FormHelperText>
          </FormControl>
        )}
      {bookingData.activityType &&
        bookingData.activityType.value !== "learning" && (
          <TextField
            label="Activity Name"
            id="activity-name"
            value={bookingData.activityName || ""}
            onChange={(event) =>
              setBookingData({
                ...bookingData,
                activityName: event.target.value,
              })
            }
            error={bookingData.error && !bookingData.activityName}
            helperText={
              bookingData.error && !bookingData.activityName ? "Required" : ""
            }
            fullWidth
            sx={{
              marginBottom: "16px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f7fafc",
                transition: "all 0.3s ease",
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
        )}
    </>
  );
};

export default BasicInfo;
