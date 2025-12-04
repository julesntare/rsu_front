import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getModule } from "../../redux/actions/ModuleActions";
import { getRoom } from "../../redux/actions/RoomActions";
import "../Bookings/bookings.scss";
import BasicInfo from "./BookingSteps/BasicInfo";
import BasicRequirements from "./BookingSteps/BasicRequirements";
import SchedulesDetails from "./BookingSteps/SchedulesDetails/SchedulesDetails";

const BookingsForm = (props) => {
  const { hasParam } = props;
  const param = useParams();
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);
  const modules = useSelector((state) => state.modules.modules);

  // Initialize bookingData with room from param if available
  const [bookingData, setBookingData] = useState(() => ({
    step: 0,
    error: false,
    isLastStep: false,
    ...(hasParam && param.id ? { room: param.id } : {}),
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Derive selectedRoom from rooms array based on param
  const selectedRoom =
    hasParam && param.id ? rooms.find((room) => room._id === param.id) : null;

  useEffect(() => {
    dispatch(getModule());
    if (hasParam) {
      dispatch(getRoom());
    }
  }, [dispatch, hasParam]);

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
    console.log(bookingData);
    if (bookingData.step === 0) {
      // Validate required fields based on activity type
      const isLearningType = bookingData.activityType?.value === "learning";
      const hasRequiredFields =
        bookingData.activityType &&
        bookingData.activityDescription &&
        (isLearningType
          ? bookingData.activityModule
          : bookingData.activityName);

      if (!hasRequiredFields) {
        setBookingData({ ...bookingData, error: true });
        return;
      }
      setIsTransitioning(true);
      setTimeout(() => {
        setBookingData({
          ...bookingData,
          error: false,
          step: bookingData.step + 1,
        });
        setIsTransitioning(false);
      }, 300);
    }
    if (bookingData.step === 1) {
      if (!bookingData.roomCategory || !bookingData.activityParticipants) {
        setBookingData({ ...bookingData, error: true });
        return;
      }
      setIsTransitioning(true);
      setTimeout(() => {
        setBookingData({
          ...bookingData,
          error: false,
          step: bookingData.step + 1,
        });
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setBookingData({
        ...bookingData,
        activityType: bookingData.activityType.value,
        activityName: bookingData.activityName,
        activityDescription: bookingData.activityDescription,
      });
      setIsLoading(false);
    }, 1500);
  };

  // handle switch case for component to load on each step
  const SteppedComponent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfo
            bookingData={bookingData}
            setBookingData={setBookingData}
            room={selectedRoom}
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
            room={selectedRoom}
          />
        );
      case 2:
        return (
          <SchedulesDetails
            bookingData={bookingData}
            setBookingData={setBookingData}
          />
        );
      default:
        return (
          <BasicInfo
            bookingData={bookingData}
            setBookingData={setBookingData}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
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

        {/* Footer with Navigation Buttons */}
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          {bookingData.step === 0 ? null : (
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
