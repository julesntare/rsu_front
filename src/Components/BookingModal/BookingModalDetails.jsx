import materialSymbolssche from "../../assets/svg/materialSymbolssche.svg";
import materialSymbolsloca from "../../assets/svg/materialSymbolsloca.svg";
import materialSymbolseven from "../../assets/svg/materialSymbolseven.svg";
import mdiuserGroup from "../../assets/svg/mdiuserGroup.svg";
import mdiaccountHelp from "../../assets/svg/mdiaccountHelp.svg";
import NumbersToOrdinalForm from "../utils/NumbersToOrdinalForm";
import NumbersToDaysForm from "../utils/NumbersToDaysForm";

const BookingModal = ({
  selectedEvent,
  bookings,
  rooms,
  users,
}) => {
  const selectedDate = bookings.find(
    (booking) => booking._id === selectedEvent
  );

  if (!selectedDate) {
    return (
      <div className="frame-1">
        <div className="flex-container-body">
          <p>Booking not found</p>
        </div>
      </div>
    );
  }

  const selectedUser = users.find((user) => user._id === selectedDate.user_id);
  const selectedRoom = rooms.find((room) => room._id === selectedDate.room);

  return (
    <div className="frame-1">
      <div className="flex-container-body">
        <div className="booking-header-section">
          <div className="flex-container-1">
            <img className="material-symbolseven" src={materialSymbolseven} />
            <h4 className="booking-title">
              {selectedDate.activity?.activity_name || "Untitled Event"}
            </h4>
          </div>
          <span
            className={`booking-status-badge ${
              selectedDate.flag === 0 ? "status-pending" : "status-confirmed"
            }`}
          >
            {selectedDate.flag === 0 ? "Pending" : "Confirmed"}
          </span>
        </div>
        {selectedDate.activity?.activity_description && (
          <div className="descriptions">
            {selectedDate.activity.activity_description}
          </div>
        )}
        <div className="flex-container-2">
          <img className="material-symbolssche" src={materialSymbolssche} />
          <span>
            {selectedDate.activity.activity_starting_date}
            {selectedDate.activity.activity_ending_date && (
              <> to {selectedDate.activity.activity_ending_date}</>
            )}
            {selectedDate.activity.activity_time?.[0]?.[0] && (
              <>
                , {selectedDate.activity.activity_time[0][0]} -{" "}
                {selectedDate.activity.activity_time[0][1]}
              </>
            )}
            {selectedDate.activity.activity_recurrence && (
              <>
                {" "}
                ({selectedDate.activity.activity_recurrence}
                {selectedDate.activity.activity_days?.[0] !== undefined && (
                  <> on {NumbersToDaysForm(selectedDate.activity.activity_days[0])}</>
                )})
              </>
            )}
          </span>
        </div>
        <div className="flex-container-3">
          <img className="mdiuser-group" src={mdiuserGroup} />
          <span className="year-4-cs">Year 4 CS</span>
        </div>
        <div className="flex-container-4">
          <div className="location-info">
            <img className="material-symbolsloca" src={materialSymbolsloca} />
            <span className="muhabura-building-fl">
              {selectedRoom &&
                `${selectedRoom.room_building.building_name} building ${
                  selectedRoom.room_floor === 0
                    ? "Ground"
                    : NumbersToOrdinalForm(selectedRoom.room_floor)
                } floor, ${selectedRoom.room_name}`}
            </span>
          </div>
          {selectedRoom && selectedDate.activity.activity_online_link && (
            <div className="rectangle-2">
              <a href={selectedDate.activity.activity_online_link} target="_blank" rel="noopener noreferrer">
                Join Online
              </a>
            </div>
          )}
        </div>
        <div className="flex-container-5">
          <img className="mdiaccount-help" src={mdiaccountHelp} />
          <div className="flex-user-booked">
            {selectedUser && (
              <>
                <span className="user-booked">
                  {selectedUser.fullname} ({selectedUser.title},{" "}
                  {selectedUser.group !== undefined && selectedUser.group})
                </span>
                <span className="user-booked">{selectedUser.email}</span>
                <span className="user-booked">{selectedUser.mobile_no}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingModal;
