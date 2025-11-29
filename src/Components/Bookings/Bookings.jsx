import React, { useState, useEffect } from "react";
import "./bookings.scss";
import "../BookingModal/BookingModalDetails.scss";
import { Modal } from "react-bootstrap";
import BookingModalDetails from "../BookingModal/BookingModalDetails";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRoom } from "../../redux/actions/RoomActions";
import { CircularProgress } from "@mui/material";
import { getBooking } from "../../redux/actions/BookingActions";
import BookingsForm from "../BookingModal/BookingsForm";
import useAuth from "../../hooks/useAuth";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { getUser } from "../../redux/actions/UserActions";
import { getModule } from "../../redux/actions/ModuleActions";

const localizer = momentLocalizer(moment);

const Bookings = () => {
  let { id } = useParams();
  const users = useSelector((state) => state.users.users);
  const rooms = useSelector((state) => state.rooms.rooms);
  const bookings = useSelector((state) => state.bookings.bookings);
  const modules = useSelector((state) => state.modules.modules);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedRoom = rooms.find((room) => room._id === id);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    dispatch(getRoom());
    dispatch(getBooking());
    dispatch(getUser());
    dispatch(getModule());
  }, [dispatch]);

  useEffect(() => {
    if (bookings.length > 0) {
      const bookedDates = id
        ? bookings.filter((booking) => booking.room === selectedRoom._id)
        : bookings;
      bookedDates.map((booking) => {
        // make algorithm to save event in state
        // 1. if activity flag is 0 change color to orange, otherwise blue
        const color = booking.flag === 0 ? "orange" : "blue";

        // 2. if activity recurrence is weekly, take the start date and add 7 days to it till the end date
        if (booking.activity.activity_recurrence === "weekly") {
          console.log(booking);
          const startDate = moment(booking.activity.activity_starting_date);
          const endDate = moment(booking.activity.activity_ending_date);
          const diff = endDate.diff(startDate, "days");
          const days = Math.ceil(diff / 7);
          for (let i = 0; i < days; i++) {
            let date = moment(booking.activity.activity_starting_date);
            date.add(i * 7, "days");
            // check if the starting date is the same as activity.activity_days[0]
            // if yes, then use starting date to repeat on the same day
            // if no, then use the date of activity.activity_days[0] to repeat on the same day
            // activity.activity_days[0] is in numbers
            // 0 is sunday, 1 is monday, 2 is tuesday, 3 is wednesday, 4 is thursday, 5 is friday, 6 is saturday
            if (date.day() === booking.activity.activity_days[0]) {
              const event = {
                id: booking._id,
                title: booking.activity.activity_name,
                start: new Date(
                  date.year(),
                  date.month(),
                  date.date(),
                  booking.activity.activity_time[0][0].split(":")[0],
                  booking.activity.activity_time[0][0].split(":")[1]
                ),
                end: new Date(
                  date.year(),
                  date.month(),
                  date.date(),

                  booking.activity.activity_time[0][1].split(":")[0],
                  booking.activity.activity_time[0][1].split(":")[1]
                ),
                color,
                activity: booking.activity,
              };
              setEvents((prev) => [...prev, event]);
            } else {
              // check a date that is the same as activity.activity_days[0] and is after the starting date
              let count = date.day();
              while (count !== booking.activity.activity_days[0]) {
                // get difference between the date and activity.activity_days[0]
                // add the difference to the date
                const diff = booking.activity.activity_days[0] - count;
                date.add(diff, "days");
                count += 1;
              }

              const event = {
                id: booking._id,
                title: booking.activity.activity_name,
                start: new Date(
                  date.year(),
                  date.month(),
                  date.date(),
                  booking.activity.activity_time[0][0].split(":")[0],
                  booking.activity.activity_time[0][0].split(":")[1]
                ),
                end: new Date(
                  date.year(),
                  date.month(),
                  date.date(),

                  booking.activity.activity_time[0][1].split(":")[0],
                  booking.activity.activity_time[0][1].split(":")[1]
                ),
                color,
                activity: booking.activity,
              };
              setEvents((prev) => [...prev, event]);
            }
          }
        }

        // 3. if activity recurrence is monthly, take the start date and add 30 days to it till the end date
        if (booking.activity.activity_recurrence === "monthly") {
          const startDate = moment(booking.activity.activity_starting_date);
          const endDate = moment(booking.activity.activity_ending_date);
          const diff = endDate.diff(startDate, "days");
          const days = Math.ceil(diff / 30);
          for (let i = 0; i < days; i++) {
            const date = moment(booking.activity.activity_starting_date).add(
              i * 30,
              "days"
            );
            const event = {
              id: booking._id,
              title: booking.activity.activity_name,
              start: new Date(
                date.year(),
                date.month(),
                date.date(),
                booking.activity.activity_time[0][0].split(":")[0],
                booking.activity.activity_time[0][0].split(":")[1]
              ),
              end: new Date(
                date.year(),
                date.month(),
                date.date(),

                booking.activity.activity_time[0][1].split(":")[0],
                booking.activity.activity_time[0][1].split(":")[1]
              ),
              color,
              activity: booking.activity,
            };
            setEvents((prev) => [...prev, event]);
          }
        }

        // 4. if activity recurrence is certain_days, take activity_days array and add the days to the start date
        if (booking.activity.activity_recurrence === "certain_days") {
          const startDate = moment(booking.activity.activity_starting_date);
          const endDate = moment(booking.activity.activity_ending_date);
          const diff = endDate.diff(startDate, "days");
          const days = Math.ceil(diff / 7);
          for (let i = 0; i < days; i++) {
            const date = moment(booking.activity.activity_starting_date).add(
              i * 7,
              "days"
            );
            const event = {
              id: booking._id,
              title: booking.activity.activity_name,
              start: new Date(
                date.year(),
                date.month(),
                date.date(),
                // string time to time
                booking.activity.activity_time[0][0].split(":")[0],
                booking.activity.activity_time[0][0].split(":")[1]
              ),
              end: new Date(
                date.year(),
                date.month(),
                date.date(),

                booking.activity.activity_time[0][1].split(":")[0],
                booking.activity.activity_time[0][1].split(":")[1]
              ),
              color,
              activity: booking.activity,
            };
            setEvents((prev) => [...prev, event]);
          }
        }
      });
    }
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: event.color,
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  };
  return (
    <>
      {/* {rooms.length > 0 ? ( */}
      <div className="row">
        <div className="col-12 col-md-12 p-3 pb-5">
          <div className="info-box border d-flex flex-column justify-content-between p-4 h-100">
            <div className="mt-auto contacts">
              <h4 className="title-room text-center mb-3">
                {selectedRoom
                  ? `Reservations for <i>${selectedRoom.room_name}</i>`
                  : "All Reservations"}
              </h4>
              {isAuthenticated && (
                <button
                  className="btn btn-primary mb-3"
                  onClick={(e) => navigate("/bookingform")}
                >
                  New Schedule
                </button>
              )}
              {/* use react calendar datepicker component to display dates and times booked */}
              <Calendar
                localizer={localizer}
                events={events}
                onDoubleClickEvent={(event) => {
                  console.log(event);
                  setSelectedEvent(event.id);
                  setShowModal(true);
                }}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                style={{ height: 500 }}
              />
              {/* generate react bootstrap modal like of google calendar event popup modal */}
              <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Body>
                  <BookingModalDetails
                    setShowModal={setShowModal}
                    selectedEvent={selectedEvent}
                    bookings={bookings}
                    rooms={rooms}
                    users={users}
                    modules={modules}
                    isAuthenticated={isAuthenticated}
                  />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      {/* ) : (
        <div className="d-flex justify-content-center align-items-center">
          <CircularProgress />
        </div>
      )} */}
    </>
  );
};

export default Bookings;
