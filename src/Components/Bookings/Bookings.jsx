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

const Bookings = () => {
  let { id } = useParams();
  const users = useSelector((state) => state.users.users);
  const rooms = useSelector((state) => state.rooms.rooms);
  const bookings = useSelector((state) => state.bookings.bookings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedRoom = rooms.find((room) => room._id === id);
  const [showModal, setShowModal] = useState(false);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { isAuthenticated } = useAuth();
  const calendarRef = useRef(null);
  const BOOKINGS_PER_PAGE = 10;

  useEffect(() => {
    dispatch(getRoom());
    dispatch(getBooking());
    dispatch(getUser());
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

      const eventMap = new Map(); // Use Map to deduplicate events by date

      bookedDates.forEach((booking) => {
        // Skip if booking doesn't have required activity data
        if (!booking.activity || !booking.activity.activity_starting_date) {
          return;
        }

        const addEvent = (dateStr) => {
          if (!eventMap.has(dateStr)) {
            eventMap.set(dateStr, {
              id: `event-${dateStr}`,
              title: "",
              start: dateStr,
              allDay: true,
              display: "background",
              backgroundColor: "rgba(46, 213, 115, 0.2)",
              extendedProps: {
                date: dateStr,
              },
            });
          }
        };

        // One-time booking (no recurrence or empty recurrence)
        if (!booking.activity.activity_recurrence || booking.activity.activity_recurrence === "once") {
          const startDate = moment(booking.activity.activity_starting_date);
          addEvent(startDate.format("YYYY-MM-DD"));
        }

        // Weekly recurrence
        if (booking.activity.activity_recurrence === "weekly") {
          const startDate = moment(booking.activity.activity_starting_date);
          const endDate = moment(booking.activity.activity_ending_date);
          const diff = endDate.diff(startDate, "days");
          const weeks = Math.ceil(diff / 7);

          for (let i = 0; i < weeks; i++) {
            let date = moment(booking.activity.activity_starting_date).add(i * 7, "days");

            if (date.day() !== booking.activity.activity_days[0]) {
              const dayDiff = booking.activity.activity_days[0] - date.day();
              date.add(dayDiff >= 0 ? dayDiff : dayDiff + 7, "days");
            }

            if (date.isSameOrBefore(endDate)) {
              addEvent(date.format("YYYY-MM-DD"));
            }
          }
        }

        // Monthly recurrence
        if (booking.activity.activity_recurrence === "monthly") {
          const startDate = moment(booking.activity.activity_starting_date);
          const endDate = moment(booking.activity.activity_ending_date);
          const months = endDate.diff(startDate, "months");

          for (let i = 0; i <= months; i++) {
            const date = moment(booking.activity.activity_starting_date).add(i, "months");
            if (date.isSameOrBefore(endDate)) {
              addEvent(date.format("YYYY-MM-DD"));
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
              let date = moment(booking.activity.activity_starting_date).add(i * 7, "days");
              const dayDiff = dayNum - date.day();
              date.add(dayDiff >= 0 ? dayDiff : dayDiff + 7, "days");

              if (date.isSameOrBefore(endDate) && date.isSameOrAfter(startDate)) {
                addEvent(date.format("YYYY-MM-DD"));
              }
            });
          }
        }
      });

      // Convert Map to array
      setEvents(Array.from(eventMap.values()));
    }
  }, [bookings, id, selectedRoom]);

  const handleDateClick = (dateClickInfo) => {
    const clickedDate = moment(dateClickInfo.dateStr).format("YYYY-MM-DD");

    // Get all bookings for this date
    const bookingsForDate = bookings.filter((booking) => {
      if (!booking.activity || !booking.activity.activity_starting_date) return false;

      const startDate = moment(booking.activity.activity_starting_date);
      const endDate = booking.activity.activity_ending_date
        ? moment(booking.activity.activity_ending_date)
        : startDate;

      // Check if clicked date is within booking range
      const clicked = moment(clickedDate);

      if (booking.activity.activity_recurrence === "weekly") {
        if (clicked.isBetween(startDate, endDate, 'day', '[]')) {
          const dayOfWeek = clicked.day();
          return booking.activity.activity_days?.includes(dayOfWeek);
        }
      } else if (booking.activity.activity_recurrence === "monthly") {
        if (clicked.isBetween(startDate, endDate, 'month', '[]')) {
          return clicked.date() === startDate.date();
        }
      } else if (booking.activity.activity_recurrence === "certain_days") {
        if (clicked.isBetween(startDate, endDate, 'day', '[]')) {
          const dayOfWeek = clicked.day();
          return booking.activity.activity_days?.includes(dayOfWeek);
        }
      } else {
        // One-time booking
        return clicked.isSame(startDate, 'day');
      }

      return false;
    });

    if (bookingsForDate.length > 0) {
      // Sort bookings by time
      const sortedBookings = [...bookingsForDate].sort((a, b) => {
        const timeA = a.activity?.activity_time?.[0]?.[0] || '00:00';
        const timeB = b.activity?.activity_time?.[0]?.[0] || '00:00';
        return timeA.localeCompare(timeB);
      });

      setSelectedDateBookings(sortedBookings);
      setSelectedBookingDetails(sortedBookings[0]); // Select first booking by default
      setSelectedDate(clickedDate); // Store the clicked date
      setCurrentPage(0); // Reset to first page
      setShowModal(true);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(selectedDateBookings.length / BOOKINGS_PER_PAGE);
  const startIndex = currentPage * BOOKINGS_PER_PAGE;
  const endIndex = startIndex + BOOKINGS_PER_PAGE;
  const currentBookings = selectedDateBookings.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      // Select first booking of new page
      const newStartIndex = newPage * BOOKINGS_PER_PAGE;
      setSelectedBookingDetails(selectedDateBookings[newStartIndex]);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      // Select first booking of new page
      const newStartIndex = newPage * BOOKINGS_PER_PAGE;
      setSelectedBookingDetails(selectedDateBookings[newStartIndex]);
    }
  };

  const handleEventClick = (clickInfo) => {
    clickInfo.jsEvent.preventDefault();
    clickInfo.jsEvent.stopPropagation();
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
                  onClick={() => navigate("/bookingform")}
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
                dateClick={handleDateClick}
                editable={false}
                selectable={true}
                selectMirror={true}
                eventDisplay="background"
                weekends={true}
                height="auto"
                contentHeight={700}
                slotMinTime="07:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                nowIndicator={true}
                dayHeaderFormat={{ weekday: "short" }}
                loading={(isLoading) => {
                  // Force re-render when loading completes
                  if (!isLoading && calendarRef.current) {
                    setTimeout(() => {
                      calendarRef.current.getApi().render();
                    }, 0);
                  }
                }}
              />
              {/* New Date Bookings Modal */}
              <Modal
                show={showModal}
                onHide={() => {
                  setShowModal(false);
                  setSelectedDateBookings([]);
                  setSelectedBookingDetails(null);
                  setSelectedDate(null);
                  setCurrentPage(0);
                }}
                size="xl"
                aria-labelledby="bookings-modal"
                centered
                className="bookings-date-modal"
              >
                <Modal.Header closeButton className="border-0 pb-0">
                  <Modal.Title>
                    <h5 className="fw-bold text-primary">
                      Bookings for{" "}
                      {selectedDate && moment(selectedDate).format("MMMM DD, YYYY")}
                    </h5>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row">
                    {/* Left Side - Bookings List */}
                    <div className="col-md-5">
                      <div className="bookings-list">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0 text-muted fw-semibold">
                            <span className="badge bg-secondary me-2">{selectedDateBookings.length}</span>
                            Booking{selectedDateBookings.length !== 1 ? "s" : ""} Available
                          </h6>
                          {totalPages > 1 && (
                            <div className="pagination-info text-muted small fw-semibold">
                              Page {currentPage + 1} of {totalPages}
                            </div>
                          )}
                        </div>
                        <div className="bookings-list-wrapper position-relative">
                          {totalPages > 1 && currentPage > 0 && (
                            <button
                              className="booking-nav-arrow booking-nav-left"
                              onClick={handlePrevPage}
                              aria-label="Previous page"
                            >
                              <i className="bi bi-chevron-left"></i>
                            </button>
                          )}

                          <div className="list-group">
                            {currentBookings.map((booking, index) => (
                              <button
                                key={booking._id}
                                className={`list-group-item list-group-item-action booking-item ${
                                  selectedBookingDetails?._id === booking._id
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => setSelectedBookingDetails(booking)}
                                style={{
                                  borderLeft: `4px solid ${
                                    booking.flag === 0 ? "#ff9800" : "#3f51b5"
                                  }`,
                                }}
                              >
                                <div className="d-flex w-100 justify-content-between align-items-start">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                      <span className="booking-number badge bg-secondary">
                                        {startIndex + index + 1}
                                      </span>
                                      <h6 className="mb-0 fw-bold">
                                        {booking.activity?.activity_name ||
                                          "Untitled Event"}
                                      </h6>
                                    </div>
                                    <p className="mb-1 small text-muted">
                                      {booking.activity?.activity_time?.[0]?.[0]} -{" "}
                                      {booking.activity?.activity_time?.[0]?.[1]}
                                    </p>
                                    <small className="text-muted">
                                      {rooms.find((r) => r._id === booking.room)
                                        ?.room_name || "Unknown Room"}
                                    </small>
                                  </div>
                                  <span
                                    className={`badge ${
                                      booking.flag === 0
                                        ? "bg-warning"
                                        : "bg-primary"
                                    }`}
                                  >
                                    {booking.flag === 0 ? "Pending" : "Confirmed"}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>

                          {totalPages > 1 && currentPage < totalPages - 1 && (
                            <button
                              className="booking-nav-arrow booking-nav-right"
                              onClick={handleNextPage}
                              aria-label="Next page"
                            >
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Booking Details */}
                    <div className="col-md-7">
                      {selectedBookingDetails ? (
                        <div className="booking-details-panel">
                          <BookingModalDetails
                            selectedEvent={selectedBookingDetails._id}
                            bookings={bookings}
                            rooms={rooms}
                            users={users}
                          />
                        </div>
                      ) : (
                        <div className="text-center text-muted py-5">
                          <p>Select a booking to view details</p>
                        </div>
                      )}
                    </div>
                  </div>
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
