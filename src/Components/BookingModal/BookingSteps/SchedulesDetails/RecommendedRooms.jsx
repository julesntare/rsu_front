import React, { useState } from "react";
import "./RecommendedRooms.scss";
import stairs from "../../../../assets/svg/stairs.svg";
import reduceCapacity from "../../../../assets/svg/reduceCapacity.svg";
import category from "../../../../assets/svg/category.svg";
import "./RecommendedRooms.scss";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AvailabilityCalendar } from "react-availability-calendar";
import moment from "moment";
import { Modal } from "react-bootstrap";

const msInHour = 60 * 60 * 1000;

const RecommendedRooms = () => {
  const [expanded, setExpanded] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleDateChange = (newStartDate, newEndDate) => {
    console.log(newStartDate, newEndDate);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const popUpBookingCalendar = (e) => {
    e.preventDefault();
    console.log("pop up booking calendar");
    setIsCalendarOpen(true);
  };

  //   calendar related
  const now = new Date();

  const onAvailabilitySelected = (a) =>
    console.log("Availability slot selected: ", a);

  const onChangedCalRange = (r) =>
    console.log("Calendar range selected (fetch bookings here): ", r);

  const blockOutPeriods = [
    [0 * msInHour, 9 * msInHour],
    [19 * msInHour, 24 * msInHour],
  ];

  const bookings = [
    {
      startDate: new Date(2020, 2, 1, 19),
      endDate: new Date(2020, 2, 1, 20),
    },
    {
      startDate: new Date(2020, 2, 1, 16, 30),
      endDate: new Date(2020, 2, 1, 17),
    },
  ];

  const providerTimeZone = "Africa/Kigali";

  return (
    <>
      <div className="recommend">
        <span className="building-name">MUHABURA</span>
        <hr className="border-bot" />
        <div className="flex-container">
          <Accordion
            className="accordion"
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <h3 className="room-name">P001</h3>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex-container-2">
                <img className="icon" src={category} />
                <span className="sub-text">Lab</span>
              </div>
              <div className="flex-container-2">
                <img className="icon" src={stairs} />
                <span className="sub-text">Ground Floor</span>
              </div>
              <div className="flex-container-2">
                <img className="icon" src={reduceCapacity} />
                <span className="sub-text">120 People</span>
              </div>
              <label className="status bg-success">Free</label>
              <button
                onClick={popUpBookingCalendar}
                className="btn btn-availability"
              >
                Availability
              </button>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>

      <Modal
        show={isCalendarOpen}
        onHide={() => setIsCalendarOpen(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          {/* UI section for selected dates & time */}
          <div className="selected-dates">
            <div className="date">
              <h3>Selected Dates</h3>
              <hr />
            </div>
            <div className="date">
              <b className="date-text">Start Date:</b>
              <i className="date-text">{startDate.toDateString()}</i>
            </div>
            <div className="date">
              <b className="date-text">End Date:</b>
              <i className="date-text">{endDate.toDateString()}</i>
            </div>
          </div>

          <AvailabilityCalendar
            bookings={bookings}
            providerTimeZone={providerTimeZone}
            moment={moment}
            initialDate={now}
            onAvailabilitySelected={onAvailabilitySelected}
            onCalRangeChanged={onChangedCalRange}
            blockOutPeriods={blockOutPeriods}
            onDaySelected={() => console.log("day selected")}
            endDate={endDate}
            onChange={handleDateChange}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default RecommendedRooms;
