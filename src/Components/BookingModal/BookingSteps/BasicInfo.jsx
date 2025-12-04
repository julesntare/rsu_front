import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import React from "react";
import Select from "react-select";
import "./Booking.css";

const options = [
  { value: "learning", label: "Learning" },
  { value: "meetup", label: "Meetup" },
  { value: "praying", label: "Praying" },
  { value: "publicTalks", label: "Public Talks" },
  { value: "practices", label: "Practices" },
  { value: "others", label: "Others" },
];

const BasicInfo = ({
  bookingData,
  setBookingData,
  room,
  modules,
  handleNext,
  isTransitioning,
}) => {
  return (
    <>
      {/* Show selected room if coming from room page */}
      {room && (
        <div style={{ marginBottom: "16px" }}>
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

      {/* Activity Type and Module/Name Row */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          alignItems: "flex-start",
        }}
      >
        {/* Activity Type */}
        <FormControl
          error={bookingData.error && !bookingData.activityType}
          style={{
            flex: bookingData.activityType ? 1 : "1 1 100%",
            zIndex: 9,
            transition: "all 0.3s ease",
          }}
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
            onChange={(selectedOption) =>
              setBookingData({
                ...bookingData,
                activityType: selectedOption,
              })
            }
            placeholder="Select an activity type"
            isSearchable
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
            style={{
              color: "#e53e3e",
              marginTop: "4px",
              fontSize: "13px",
            }}
          >
            {bookingData.error && !bookingData.activityType
              ? "Please select an activity type"
              : ""}
          </FormHelperText>
        </FormControl>

        {/* Activity Module (for learning type) */}
        {bookingData.activityType &&
          bookingData.activityType.value === "learning" && (
            <FormControl
              error={bookingData.error && !bookingData.activityModule}
              style={{ flex: 1 }}
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
                      label:
                        module.module_name + " (" + module.module_code + ")",
                    };
                  })
                }
                value={bookingData.activityModule || ""}
                onChange={(selectedOption) =>
                  setBookingData({
                    ...bookingData,
                    activityModule: selectedOption,
                  })
                }
                placeholder="Select an activity module"
                isSearchable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
                style={{
                  color: "#e53e3e",
                  marginTop: "4px",
                  fontSize: "13px",
                }}
              >
                {bookingData.error && !bookingData.activityModule
                  ? "Please select a module"
                  : ""}
              </FormHelperText>
            </FormControl>
          )}

        {/* Activity Name (for non-learning types) */}
        {bookingData.activityType &&
          bookingData.activityType.value !== "learning" && (
            <div style={{ flex: 1 }}>
              <label
                style={{
                  marginBottom: "6px",
                  display: "block",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#2d3748",
                }}
              >
                Activity Name <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <TextField
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
                  bookingData.error && !bookingData.activityName
                    ? "Required"
                    : ""
                }
                fullWidth
                placeholder="Enter activity name"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    minHeight: "42px",
                    borderRadius: "10px",
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
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    padding: "9px 12px",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#e53e3e",
                    marginTop: "4px",
                    fontSize: "13px",
                  },
                }}
              />
            </div>
          )}
      </div>

      {/* Activity Description */}
      <div style={{ marginBottom: "14px", position: "relative" }}>
        <TextField
          label={
            <span>
              Activity Description <span style={{ color: "#e53e3e" }}>*</span>
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
              : ""
          }
          fullWidth
          multiline
          rows={3}
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {isTransitioning ? "Loading..." : "Continue"}
        </Button>
      </div>
    </>
  );
};

export default BasicInfo;
