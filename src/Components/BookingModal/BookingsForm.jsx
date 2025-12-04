import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { getModule } from "../../redux/actions/ModuleActions";
import { getRoom } from "../../redux/actions/RoomActions";
import "../Bookings/bookings.scss";
import BasicInfo from "./BookingSteps/BasicInfo";
import BasicRequirements from "./BookingSteps/BasicRequirements";
import SchedulesDetails from "./BookingSteps/SchedulesDetails/SchedulesDetails";

const BookingsForm = (props) => {
  const { hasParam, onClose } = props;
  const param = useParams();
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);
  const modules = useSelector((state) => state.modules.modules);

  // Initialize bookingData with unified field names
  const [bookingData, setBookingData] = useState(() => ({
    step: 0,
    error: false,
    errorMessage: "",
    // Activity Info (Step 0)
    activityType: null,
    activityName: "",
    activityModule: null,
    activityDescription: "",
    // Requirements (Step 1)
    roomCategory: null,
    activityParticipants: "",
    selectedRoom: hasParam && param.id ? param.id : null,
    // Schedule (Step 2)
    startingDate: "",
    endingDate: "",
    recurrence: { value: "once", label: "Once" },
    activityDays: [],
    activityTime: [["08:00", "17:00"]],
    // Additional
    additionalInfo: "",
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Derive selectedRoom from rooms array
  const selectedRoomObject = rooms.find(
    (room) => room._id === bookingData.selectedRoom
  );

  useEffect(() => {
    dispatch(getModule());
    dispatch(getRoom());
  }, [dispatch]);

  // go to previous step
  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setBookingData({ ...bookingData, step: bookingData.step - 1 });
      setIsTransitioning(false);
    }, 300);
  };

  // go to next step
  const handleNext = () => {
    // Step 0: Basic Info Validation
    if (bookingData.step === 0) {
      const isLearningType = bookingData.activityType?.value === "learning";
      const hasRequiredFields =
        bookingData.activityType &&
        bookingData.activityDescription &&
        (isLearningType
          ? bookingData.activityModule
          : bookingData.activityName);

      if (!hasRequiredFields) {
        setBookingData({
          ...bookingData,
          error: true,
          errorMessage: "Please fill in all required fields",
        });
        return;
      }

      setIsTransitioning(true);
      setTimeout(() => {
        setBookingData({
          ...bookingData,
          error: false,
          errorMessage: "",
          step: bookingData.step + 1,
        });
        setIsTransitioning(false);
      }, 300);
      return;
    }

    // Step 1: Requirements Validation
    if (bookingData.step === 1) {
      if (!bookingData.roomCategory || !bookingData.activityParticipants) {
        setBookingData({
          ...bookingData,
          error: true,
          errorMessage:
            "Please select room category and enter number of participants",
        });
        return;
      }

      const participants = parseInt(bookingData.activityParticipants);
      if (isNaN(participants) || participants < 1) {
        setBookingData({
          ...bookingData,
          error: true,
          errorMessage: "Please enter a valid number of participants",
        });
        return;
      }

      setIsTransitioning(true);
      setTimeout(() => {
        setBookingData({
          ...bookingData,
          error: false,
          errorMessage: "",
          step: bookingData.step + 1,
        });
        setIsTransitioning(false);
      }, 300);
      return;
    }

    // Step 2: Schedule & Submit
    if (bookingData.step === 2) {
      handleSubmit();
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate schedule fields
    if (!bookingData.startingDate) {
      setBookingData({
        ...bookingData,
        error: true,
        errorMessage: "Please select a starting date",
      });
      return;
    }

    // Validate recurring bookings have days selected
    if (
      bookingData.recurrence?.value !== "once" &&
      (!bookingData.activityDays || bookingData.activityDays.length === 0)
    ) {
      setBookingData({
        ...bookingData,
        error: true,
        errorMessage: "Please select at least one day for recurring bookings",
      });
      return;
    }

    // Validate time slots
    if (!bookingData.activityTime || bookingData.activityTime.length === 0) {
      setBookingData({
        ...bookingData,
        error: true,
        errorMessage: "Please select at least one time slot",
      });
      return;
    }

    // Validate room selection
    if (!bookingData.selectedRoom) {
      setBookingData({
        ...bookingData,
        error: true,
        errorMessage: "Please select a room from the recommended list",
      });
      return;
    }

    setIsLoading(true);
    setBookingData({ ...bookingData, error: false, errorMessage: "" });

    // Get user ID from JWT token
    const token = localStorage.getItem("rsuToken");
    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId =
        decodedToken.user ||
        decodedToken.id ||
        decodedToken._id ||
        decodedToken.userId ||
        decodedToken.sub;
    } catch (error) {
      setIsLoading(false);
      setBookingData({
        ...bookingData,
        error: true,
        errorMessage: "Unable to get user information. Please login again.",
      });
      console.error("JWT decode error:", error);
      return;
    }

    if (!userId) {
      setIsLoading(false);
      setBookingData({
        ...bookingData,
        error: true,
        errorMessage: "User ID not found. Please login again.",
      });
      return;
    }

    // Prepare the booking payload
    const bookingPayload = {
      user_id: userId,
      all_authorized: [userId],
      activity: {
        activity_name:
          bookingData.activityType?.value === "learning"
            ? bookingData.activityModule?.label
            : bookingData.activityName,
        activity_description: bookingData.activityDescription || "",
        activity_starting_date: bookingData.startingDate,
        activity_ending_date:
          bookingData.endingDate || bookingData.startingDate,
        activity_recurrence: bookingData.recurrence?.value || "once",
        activity_days:
          bookingData.activityDays?.map((day) => day.text || day) || null,
        activity_time: bookingData.activityTime,
      },
      room: bookingData.selectedRoom,
      additional_info: bookingData.additionalInfo || "",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_RSU_API_URL}/bookings/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.message === "Booking created successfully.") {
        alert("Booking created successfully!");

        // Close modal or navigate
        if (onClose) {
          onClose();
        } else {
          window.location.reload();
        }
      } else {
        setBookingData({
          ...bookingData,
          error: true,
          errorMessage: data.message || "Failed to create booking",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setBookingData({
        ...bookingData,
        error: true,
        errorMessage: "Error creating booking: " + error.message,
      });
      console.error("Booking error:", error);
    }
  };

  // handle switch case for component to load on each step
  const SteppedComponent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfo
            bookingData={bookingData}
            setBookingData={setBookingData}
            room={selectedRoomObject}
            hasParam={hasParam}
            modules={modules}
            handleNext={handleNext}
            isTransitioning={isTransitioning}
          />
        );
      case 1:
        return (
          <BasicRequirements
            bookingData={bookingData}
            setBookingData={setBookingData}
            rooms={rooms}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            isTransitioning={isTransitioning}
          />
        );
      case 2:
        return (
          <SchedulesDetails
            bookingData={bookingData}
            setBookingData={setBookingData}
            rooms={rooms}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            isTransitioning={isTransitioning}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <BasicInfo
            bookingData={bookingData}
            setBookingData={setBookingData}
            modules={modules}
            handleNext={handleNext}
            isTransitioning={isTransitioning}
          />
        );
    }
  };

  // Step labels for progress indicator
  const stepLabels = ["Basic Information", "Requirements", "Schedule Details"];

  return (
    <div
      className="col-12 col-md-12"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        className="form-box p-3"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxHeight: "100vh",
        }}
      >
        {/* Compact Header Section */}
        <div style={{ marginBottom: "12px", flexShrink: 0 }}>
          <h4
            className="form-title fw-bold text-center"
            style={{ fontSize: "18px", marginBottom: "12px" }}
          >
            Fill out the Below Information
          </h4>

          {/* Compact Progress Indicator */}
          <div style={{ marginBottom: "12px" }}>
            <div className="booking-progress-steps">
              {stepLabels.map((label, index) => (
                <div
                  key={index}
                  className={`booking-progress-step ${
                    index === bookingData.step
                      ? "active"
                      : index < bookingData.step
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="step-circle">
                    {index < bookingData.step ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.5 4L6 11.5L2.5 8"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="step-label">{label}</span>
                  {index < stepLabels.length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            marginBottom: "12px",
            paddingRight: "4px",
          }}
        >
          <div
            className={`booking-step-content ${
              isTransitioning ? "transitioning" : ""
            }`}
          >
            {SteppedComponent(bookingData.step)}
          </div>
        </div>

        {/* Footer with Navigation Buttons - Only show for step 0 */}
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          {bookingData.step === 0 ||
          bookingData.step === 1 ||
          bookingData.step === 2 ? null : (
            <>
              {bookingData.isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  type="button"
                  style={{ float: "right" }}
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={
                    isLoading && <span className="button-spinner"></span>
                  }
                >
                  {isLoading ? "Submitting..." : "Finish"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  type="button"
                  style={{ float: "right" }}
                  variant="contained"
                  color="primary"
                  disabled={isTransitioning}
                  startIcon={
                    isTransitioning && <span className="button-spinner"></span>
                  }
                >
                  {isTransitioning ? "Loading..." : "Continue"}
                </Button>
              )}
              <Button
                onClick={handlePrevious}
                type="button"
                style={{ float: "right", marginRight: "10px" }}
                variant="contained"
                color="secondary"
                disabled={isTransitioning || isLoading}
              >
                Previous
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsForm;
