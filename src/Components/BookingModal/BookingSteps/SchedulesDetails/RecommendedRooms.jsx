import React, { useState, useMemo } from "react";
import "./RecommendedRooms.scss";
import stairs from "../../../../assets/svg/stairs.svg";
import reduceCapacity from "../../../../assets/svg/reduceCapacity.svg";
import category from "../../../../assets/svg/category.svg";
import {
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

const RecommendedRooms = ({ bookingData, setBookingData, rooms }) => {
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

  // Extract values to avoid optional chaining in dependencies
  const roomCategoryValue = bookingData?.roomCategory?.value;
  const activityParticipants = bookingData?.activityParticipants;

  // Use useMemo to filter rooms based on booking requirements
  const recommendedRooms = useMemo(() => {
    if (roomCategoryValue && activityParticipants) {
      // Filter rooms by category and capacity
      const filtered = rooms.filter((room) => {
        const matchesCategory = room.room_type?._id === roomCategoryValue;
        const matchesCapacity = room.capacity >= parseInt(activityParticipants);
        return matchesCategory && matchesCapacity;
      });

      return filtered;
    }
    return [];
  }, [roomCategoryValue, activityParticipants, rooms]);

  const handleOpenRoomDetails = (room) => {
    setSelectedRoomDetails(room);
  };

  const handleCloseRoomDetails = () => {
    setSelectedRoomDetails(null);
  };

  const handleSelectRoom = (roomId) => {
    setBookingData({
      ...bookingData,
      selectedRoom: roomId,
    });
    handleCloseRoomDetails();
  };

  if (!bookingData?.roomCategory || !bookingData?.activityParticipants) {
    return (
      <div className="recommend">
        <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
          Recommended Rooms
        </h4>
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#718096",
            fontSize: "14px",
          }}
        >
          Please complete the requirements step to see recommended rooms
        </div>
      </div>
    );
  }

  return (
    <div className="recommend">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "2px solid #e2e8f0",
        }}
      >
        <h4 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
          Recommended Rooms
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {bookingData.selectedRoom && (
            <Chip
              icon={<CheckCircleIcon style={{ fontSize: "14px" }} />}
              label="1 Selected"
              size="small"
              sx={{
                backgroundColor: "#48bb78",
                color: "white",
                fontWeight: 600,
                fontSize: "11px",
                height: "24px",
              }}
            />
          )}
          <Chip
            label={`${recommendedRooms.length} Available`}
            size="small"
            sx={{
              backgroundColor: "#edf2f7",
              color: "#4a5568",
              fontWeight: 500,
              fontSize: "11px",
              height: "24px",
            }}
          />
        </div>
      </div>

      {recommendedRooms.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#e53e3e",
            fontSize: "14px",
          }}
        >
          <p>No rooms available matching your requirements:</p>
          <ul style={{ textAlign: "left", fontSize: "13px", color: "#718096" }}>
            <li>Category: {bookingData.roomCategory?.label}</li>
            <li>Min Capacity: {bookingData.activityParticipants} people</li>
          </ul>
          <p style={{ fontSize: "13px", marginTop: "12px" }}>
            Try adjusting your requirements or selecting a different category.
          </p>
        </div>
      ) : (
        <>
          {/* Group rooms by building */}
          {Object.entries(
            recommendedRooms.reduce((acc, room) => {
              const buildingName =
                room.room_building?.building_name || "Unknown Building";
              if (!acc[buildingName]) {
                acc[buildingName] = [];
              }
              acc[buildingName].push(room);
              return acc;
            }, {})
          ).map(([buildingName, buildingRooms]) => (
            <div key={buildingName} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  padding: "8px 12px",
                  backgroundColor: "#f7fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#2d3748",
                  }}
                >
                  {buildingName}
                </span>
                <Chip
                  label={`${buildingRooms.length} room${
                    buildingRooms.length > 1 ? "s" : ""
                  }`}
                  size="small"
                  sx={{
                    backgroundColor: "white",
                    fontSize: "11px",
                    height: "20px",
                    fontWeight: 500,
                  }}
                />
              </div>
              <div className="flex-container">
                {buildingRooms.map((room) => {
                  const isSelected = bookingData.selectedRoom === room._id;
                  const capacityPercentage = Math.round(
                    (parseInt(bookingData.activityParticipants) /
                      room.capacity) *
                      100
                  );

                  return (
                    <div
                      key={room._id}
                      className="room-card"
                      onClick={() => handleOpenRoomDetails(room)}
                      style={{
                        border: isSelected
                          ? "2px solid #667eea"
                          : "1px solid #e2e8f0",
                        backgroundColor: isSelected ? "#f0f4ff" : "white",
                        boxShadow: isSelected
                          ? "0 4px 12px rgba(102, 126, 234, 0.25)"
                          : "0 1px 3px rgba(0, 0, 0, 0.05)",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        padding: "14px",
                        margin: "5px",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(0, 0, 0, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.boxShadow =
                            "0 1px 3px rgba(0, 0, 0, 0.05)";
                        }
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          width: "100%",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3
                            className="room-name"
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              fontWeight: 600,
                              color: isSelected ? "#667eea" : "#2d3748",
                            }}
                          >
                            {room.room_name}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginTop: "6px",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#718096",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <img
                                src={stairs}
                                alt="floor"
                                style={{ width: "12px", height: "12px" }}
                              />
                              Floor {room.room_floor}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#718096",
                              }}
                            >
                              •
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color:
                                  capacityPercentage > 90
                                    ? "#e53e3e"
                                    : "#48bb78",
                                fontWeight: 600,
                              }}
                            >
                              {room.capacity} seats
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#718096",
                              }}
                            >
                              •
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#718096",
                              }}
                            >
                              {room.room_type?.room_type_name || "N/A"}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircleIcon
                            sx={{
                              fontSize: "20px",
                              color: "#667eea",
                            }}
                          />
                        )}
                      </div>

                      {/* Capacity bar preview */}
                      <div style={{ marginTop: "10px" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "4px",
                            backgroundColor: "#e2e8f0",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${capacityPercentage}%`,
                              height: "100%",
                              backgroundColor:
                                capacityPercentage > 90
                                  ? "#e53e3e"
                                  : capacityPercentage > 70
                                  ? "#ed8936"
                                  : "#48bb78",
                              borderRadius: "2px",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Summary of selection */}
          {bookingData.selectedRoom && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                backgroundColor: "#f0f4ff",
                borderRadius: "8px",
                border: "2px solid #667eea",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: "20px", color: "#667eea" }} />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#718096",
                      margin: 0,
                      marginBottom: "2px",
                      fontWeight: 500,
                    }}
                  >
                    Selected Room
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#2d3748",
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    {
                      recommendedRooms.find(
                        (r) => r._id === bookingData.selectedRoom
                      )?.room_name
                    }
                  </p>
                </div>
                <button
                  onClick={() => handleSelectRoom(null)}
                  style={{
                    background: "none",
                    border: "1px solid #e2e8f0",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    color: "#718096",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontWeight: 500,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#fee";
                    e.currentTarget.style.borderColor = "#fc8181";
                    e.currentTarget.style.color = "#c53030";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#718096";
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Room Details Dialog */}
      {selectedRoomDetails && (
        <Dialog
          open={Boolean(selectedRoomDetails)}
          onClose={handleCloseRoomDetails}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "12px",
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#2d3748",
                }}
              >
                {selectedRoomDetails.room_name}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#718096",
                  marginTop: "4px",
                }}
              >
                {selectedRoomDetails.room_building?.building_name ||
                  "Unknown Building"}
              </p>
            </div>
            <IconButton onClick={handleCloseRoomDetails} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ paddingTop: "20px" }}>
            <div
              style={{
                backgroundColor: "#f7fafc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <img className="icon" src={category} alt="category" />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#4a5568",
                    fontWeight: 500,
                  }}
                >
                  {selectedRoomDetails.room_type?.room_type_name || "N/A"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <img className="icon" src={stairs} alt="floor" />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#4a5568",
                    fontWeight: 500,
                  }}
                >
                  Floor {selectedRoomDetails.room_floor || "N/A"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <img className="icon" src={reduceCapacity} alt="capacity" />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#4a5568",
                      fontWeight: 500,
                    }}
                  >
                    {selectedRoomDetails.capacity} People Capacity
                  </span>
                </div>
                <Tooltip
                  title={`${Math.round(
                    (parseInt(bookingData.activityParticipants) /
                      selectedRoomDetails.capacity) *
                      100
                  )}% of capacity will be used`}
                >
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: "16px",
                      color: "#a0aec0",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </div>
            </div>

            {/* Capacity indicator bar */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#718096",
                    fontWeight: 500,
                  }}
                >
                  Capacity Usage
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color:
                      Math.round(
                        (parseInt(bookingData.activityParticipants) /
                          selectedRoomDetails.capacity) *
                          100
                      ) > 90
                        ? "#e53e3e"
                        : Math.round(
                            (parseInt(bookingData.activityParticipants) /
                              selectedRoomDetails.capacity) *
                              100
                          ) > 70
                        ? "#ed8936"
                        : "#48bb78",
                  }}
                >
                  {Math.round(
                    (parseInt(bookingData.activityParticipants) /
                      selectedRoomDetails.capacity) *
                      100
                  )}
                  %
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.round(
                      (parseInt(bookingData.activityParticipants) /
                        selectedRoomDetails.capacity) *
                        100
                    )}%`,
                    height: "100%",
                    backgroundColor:
                      Math.round(
                        (parseInt(bookingData.activityParticipants) /
                          selectedRoomDetails.capacity) *
                          100
                      ) > 90
                        ? "#e53e3e"
                        : Math.round(
                            (parseInt(bookingData.activityParticipants) /
                              selectedRoomDetails.capacity) *
                              100
                          ) > 70
                        ? "#ed8936"
                        : "#48bb78",
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            {/* Room availability status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Chip
                label="Available"
                size="small"
                sx={{
                  backgroundColor: "#c6f6d5",
                  color: "#22543d",
                  fontSize: "12px",
                  fontWeight: 600,
                  height: "28px",
                }}
              />
              {selectedRoomDetails.capacity >=
                parseInt(bookingData.activityParticipants) && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#48bb78",
                    fontWeight: 600,
                  }}
                >
                  Perfect match
                </span>
              )}
            </div>
          </DialogContent>
          <DialogActions
            sx={{ padding: "16px", borderTop: "1px solid #e2e8f0" }}
          >
            <Button
              onClick={handleCloseRoomDetails}
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSelectRoom(selectedRoomDetails._id)}
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor:
                  bookingData.selectedRoom === selectedRoomDetails._id
                    ? "#48bb78"
                    : "#667eea",
                "&:hover": {
                  backgroundColor:
                    bookingData.selectedRoom === selectedRoomDetails._id
                      ? "#38a169"
                      : "#5568d3",
                },
              }}
              startIcon={
                bookingData.selectedRoom === selectedRoomDetails._id ? (
                  <CheckCircleIcon sx={{ fontSize: "18px" }} />
                ) : null
              }
            >
              {bookingData.selectedRoom === selectedRoomDetails._id
                ? "Selected"
                : "Select This Room"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default RecommendedRooms;
