import React from "react";
import materialSymbolssche from "../../assets/svg/materialSymbolssche.svg";
import materialSymbolsloca from "../../assets/svg/materialSymbolsloca.svg";
import mdiclose from "../../assets/svg/mdiclose.svg";
import materialSymbolseven from "../../assets/svg/materialSymbolseven.svg";
import mdiuserGroup from "../../assets/svg/mdiuserGroup.svg";
import materialSymbolsedit from "../../assets/svg/materialSymbolsedit.svg";
import mdiaccountHelp from "../../assets/svg/mdiaccountHelp.svg";
import materialSymbolsdele from "../../assets/svg/materialSymbolsdele.svg";
import NumbersToOrdinalForm from "../utils/NumbersToOrdinalForm";
import NumbersToDaysForm from "../utils/NumbersToDaysForm";

const BookingModal = ({
  setShowModal,
  selectedEvent,
  bookings,
  rooms,
  users,
  modules,
  isAuthenticated,
}) => {
  const selectedDate = bookings.find(
    (booking) => booking._id === selectedEvent
  );
  const selectedUser = users.find((user) => user._id === selectedDate.user_id);
  const selectedRoom = rooms.find((room) => room._id === selectedDate.room);

  return (
    <div className="frame-1">
      <header>
        <div className="flex-container">
          {isAuthenticated && (
            <>
              <img className="material-symbolsedit" src={materialSymbolsedit} />
              <img className="material-symbolsdele" src={materialSymbolsdele} />
            </>
          )}
          <img
            className="mdiclose"
            src={mdiclose}
            onClick={() => setShowModal(false)}
          />
        </div>
      </header>
      <div className="flex-container-body">
        <div className="flex-container-1">
          <img className="material-symbolseven" src={materialSymbolseven} />
          <h4>{selectedDate.activity.activity_name} {selectedDate.flag === 0 && selectedDate.activity.activity_module}</h4>
        </div>
        <div className="descriptions">
          {selectedDate.activity.activity_description}
        </div>
        <div className="flex-container-2">
          <img className="material-symbolssche" src={materialSymbolssche} />
          <span>
            {selectedDate.activity.activity_starting_date} to{" "}
            {selectedDate.activity.activity_ending_date},{" "}
            {selectedDate.activity.activity_time[0][0]} -{" "}
            {selectedDate.activity.activity_time[0][1]} (
            {selectedDate.activity.activity_recurrence} on{" "}
            {NumbersToDaysForm(selectedDate.activity.activity_days[0])})
          </span>
        </div>
        <div className="flex-container-3">
          <img className="mdiuser-group" src={mdiuserGroup} />
          <span className="year-4-cs">Year 4 CS</span>
        </div>
        <div className="flex-container-4">
          <img className="material-symbolsloca" src={materialSymbolsloca} />
          <span className="muhabura-building-fl">
            {selectedRoom &&
              `${selectedRoom.room_building.building_name} building ${
                selectedRoom.room_floor === 0
                  ? "Ground"
                  : NumbersToOrdinalForm(selectedRoom.room_floor)
              } floor, ${selectedRoom.room_name}`}
          </span>
          {selectedRoom && selectedDate.activity.activity_online_link && (
            <div className="rectangle-2">
              <a href={selectedDate.activity.activity_online_link}>
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
        <div className="rectangle-1">
          {isAuthenticated && (
            <>
              <div className="rectangle-3-1">
                <a href="#">Occupy Now</a>
              </div>
              <div className="rectangle-3-2">
                <a href="#">Free It</a>
              </div>
            </>
          )}
          <div className="rectangle-3">
            <a href="#" onClick={() => setShowModal(false)}>
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingModal;
