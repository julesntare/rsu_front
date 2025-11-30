import { useState, useEffect, useRef } from "react";
import "./bookings.scss";
import "../BookingModal/BookingModalDetails.scss";
import { Modal } from "react-bootstrap";
import BookingModalDetails from "../BookingModal/BookingModalDetails";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRoom } from "../../redux/actions/RoomActions";
import { getBooking } from "../../redux/actions/BookingActions";
import useAuth from "../../hooks/useAuth";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { getUser } from "../../redux/actions/UserActions";
import { getModule } from "../../redux/actions/ModuleActions";

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
  const calendarRef = useRef(null);

  useEffect(() => {
    dispatch(getRoom());
    dispatch(getBooking());
    dispatch(getUser());
    dispatch(getModule());
  }, [dispatch]);

  // Force calendar to render after component mounts
  useEffect(() => {
    if (calendarRef.current) {
      const timer = setTimeout(() => {
        calendarRef.current.getApi().render();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      const bookedDates = id
        ? bookings.filter((booking) => booking.room === selectedRoom?._id)
        : bookings;

      const processedEvents = [];

      bookedDates.forEach((booking) => {
        // if activity flag is 0 change color to orange, otherwise blue
        const backgroundColor = booking.flag === 0 ? "#ff9800" : "#3f51b5";
        const borderColor = booking.flag === 0 ? "#f57c00" : "#303f9f";

        // Weekly recurrence
        if (booking.activity.activity_recurrence === "weekly") {
          const startDate = moment(booking.activity.activity_starting_date);
          const endDate = moment(booking.activity.activity_ending_date);
          const diff = endDate.diff(startDate, "days");
          const weeks = Math.ceil(diff / 7);

          for (let i = 0; i < weeks; i++) {
            let date = moment(booking.activity.activity_starting_date).add(
              i * 7,
              "days"
            );

            if (date.day() !== booking.activity.activity_days[0]) {
              const dayDiff = booking.activity.activity_days[0] - date.day();
              date.add(dayDiff >= 0 ? dayDiff : dayDiff + 7, "days");
            }

            if (date.isSameOrBefore(endDate)) {
              processedEvents.push({
                id: `${booking._id}-${i}`,
                title: booking.activity.activity_name,
                start: `${date.format("YYYY-MM-DD")}T${
                  booking.activity.activity_time[0][0]
                }`,
                end: `${date.format("YYYY-MM-DD")}T${
                  booking.activity.activity_time[0][1]
                }`,
                backgroundColor,
                borderColor,
                extendedProps: {
                  bookingId: booking._id,
                  activity: booking.activity,
                  flag: booking.flag,
                },
              });
            }
          }
        }

        // Monthly recurrence
        if (booking.activity.activity_recurrence === "monthly") {
          const startDate = moment(booking.activity.activity_starting_date);
          const endDate = moment(booking.activity.activity_ending_date);
          const months = endDate.diff(startDate, "months");

          for (let i = 0; i <= months; i++) {
            const date = moment(booking.activity.activity_starting_date).add(
              i,
              "months"
            );

            if (date.isSameOrBefore(endDate)) {
              processedEvents.push({
                id: `${booking._id}-${i}`,
                title: booking.activity.activity_name,
                start: `${date.format("YYYY-MM-DD")}T${
                  booking.activity.activity_time[0][0]
                }`,
                end: `${date.format("YYYY-MM-DD")}T${
                  booking.activity.activity_time[0][1]
                }`,
                backgroundColor,
                borderColor,
                extendedProps: {
                  bookingId: booking._id,
                  activity: booking.activity,
                  flag: booking.flag,
                },
              });
            }
          }
        }

        // Certain days recurrence
        if (booking.activity.activity_recurrence === "certain_days") {
          const startDate = moment(booking.activity.activity_starting_date);
          const endDate = moment(booking.activity.activity_ending_date);
          const diff = endDate.diff(startDate, "days");
          const weeks = Math.ceil(diff / 7);

          for (let i = 0; i < weeks; i++) {
            booking.activity.activity_days.forEach((dayNum) => {
              let date = moment(booking.activity.activity_starting_date).add(
                i * 7,
                "days"
              );
              const dayDiff = dayNum - date.day();
              date.add(dayDiff >= 0 ? dayDiff : dayDiff + 7, "days");

              if (
                date.isSameOrBefore(endDate) &&
                date.isSameOrAfter(startDate)
              ) {
                processedEvents.push({
                  id: `${booking._id}-${i}-${dayNum}`,
                  title: booking.activity.activity_name,
                  start: `${date.format("YYYY-MM-DD")}T${
                    booking.activity.activity_time[0][0]
                  }`,
                  end: `${date.format("YYYY-MM-DD")}T${
                    booking.activity.activity_time[0][1]
                  }`,
                  backgroundColor,
                  borderColor,
                  extendedProps: {
                    bookingId: booking._id,
                    activity: booking.activity,
                    flag: booking.flag,
                  },
                });
              }
            });
          }
        }
      });

      setEvents(processedEvents);
    }
  }, [bookings, id, selectedRoom]);

  const handleEventClick = (clickInfo) => {
    const bookingId = clickInfo.event.extendedProps.bookingId;
    setSelectedEvent(bookingId);
    setShowModal(true);
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
              {/* FullCalendar component */}
              <FullCalendar
                ref={calendarRef}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  listPlugin,
                  interactionPlugin,
                ]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                events={events}
                eventClick={handleEventClick}
                editable={isAuthenticated}
                selectable={isAuthenticated}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                height="auto"
                contentHeight={700}
                slotMinTime="07:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                nowIndicator={true}
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  meridiem: false,
                }}
                slotLabelFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  meridiem: false,
                }}
                dayHeaderFormat={{ weekday: 'short' }}
                loading={(isLoading) => {
                  // Force re-render when loading completes
                  if (!isLoading && calendarRef.current) {
                    setTimeout(() => {
                      calendarRef.current.getApi().render();
                    }, 0);
                  }
                }}
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
