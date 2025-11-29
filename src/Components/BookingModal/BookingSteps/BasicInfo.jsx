import { FormControl, FormHelperText, TextField } from "@mui/material";
import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import Select from "react-select";
import { WithContext as ReactTags } from "react-tag-input";
import "./Booking.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const suggestions = DAYS.map((day) => {
  return {
    id: day,
    text: day,
  };
});

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const options = [
  { value: "learning", label: "Learning" },
  { value: "meetup", label: "Meetup" },
  { value: "praying", label: "Praying" },
  { value: "publicTalks", label: "Public Talks" },
  { value: "practices", label: "Practices" },
  { value: "others", label: "Others" },
];

const recurrence_options = [
  { value: "once", label: "Once" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "certain_days", label: "Certain Days" },
];

const BasicInfo = ({
  bookingData,
  setBookingData,
  room,
  hasParam,
  modules,
}) => {
  const [tags, setTags] = useState([]);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
    setBookingData({
      ...bookingData,
      activity_days: tags,
    });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  return (
    <>
      {room && (
        <label style={{ fontSize: "20px" }}>
          Select Room:
          <b>
            <em> {room.room_name}</em>
          </b>
          <hr />
        </label>
      )}
      {hasParam && (
        <div className="d-flex justify-content-between">
          <div className="col-md-5">
            {/* add starting end ending date fields */}
            <FormControl
              style={{ width: "100%", marginBottom: "20px", zIndex: 99 }}
            >
              <label className="mt-3">
                <b>Event Recurrence:</b>
              </label>
              <Select
                options={recurrence_options}
                value={bookingData.recurrence || recurrence_options[0]}
                error={bookingData.error && !bookingData.recurrence}
                helperText={
                  bookingData.error && !bookingData.recurrence ? "Required" : ""
                }
                onChange={(selectedOption) => {
                  console.log(bookingData.activityStartDate);
                  switch (selectedOption.value) {
                    case "once":
                      setBookingData({
                        ...bookingData,
                        recurrence: selectedOption,
                        activityEndDate:
                          bookingData.activityStartDate || new Date(),
                      });
                      break;
                    case "weekly":
                      setBookingData({
                        ...bookingData,
                        recurrence: selectedOption,
                        activityEndDate: new Date(
                          new Date(
                            bookingData.activityStartDate || new Date()
                          ).setDate(
                            new Date(bookingData.activityStartDate).getDate() +
                              7
                          )
                        )
                          .toISOString()
                          .slice(0, 10),
                      });
                      break;
                    case "monthly":
                      setBookingData({
                        ...bookingData,
                        recurrence: selectedOption,
                        activityEndDate: new Date(
                          new Date(
                            bookingData.activityStartDate || new Date()
                          ).setMonth(
                            new Date(
                              bookingData.activityStartDate || new Date()
                            ).getMonth() + 1
                          )
                        )
                          .toISOString()
                          .slice(0, 10),
                      });
                      break;
                    default:
                      setBookingData({
                        ...bookingData,
                        activityEndDate:
                          bookingData.activityStartDate || new Date(),
                      });
                      break;
                  }
                }}
                placeholder="Select event recurrence"
                isSearchable
              />
            </FormControl>
            {/* if booking.recurrence is not once, add tag input field for days of week */}
            {bookingData.recurrence &&
              bookingData.recurrence.value !== "once" && (
                <ReactTags
                  tags={tags}
                  suggestions={suggestions}
                  delimiters={delimiters}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  inputFieldPosition="bottom"
                  autocomplete
                  placeholder="Select day(s) to reserve (i.e type: Monday, Tuesday,...)"
                />
              )}
            <div className="d-flex flex-column">
              <label>
                <b>Expected Start Date:</b>
              </label>
              <DatePicker
                mobileLabels={{
                  date: "Date",
                  month: "Month",
                  year: "Year",
                }}
                value={bookingData.activityStartDate || new Date()}
                onChange={(e) => {
                  setBookingData({
                    ...bookingData,
                    activityStartDate: e,
                  });
                  if (bookingData.recurrence) {
                    switch (bookingData.recurrence.value) {
                      case "weekly":
                        setBookingData({
                          ...bookingData,
                          activityEndDate: new Date(
                            new Date(e).setDate(new Date(e).getDate() + 7)
                          )
                            .toISOString()
                            .slice(0, 10),
                        });
                        break;
                      case "monthly":
                        setBookingData({
                          ...bookingData,
                          activityEndDate: new Date(
                            new Date(e).setMonth(new Date(e).getMonth() + 1)
                          )
                            .toISOString()
                            .slice(0, 10),
                        });
                        break;
                      default:
                        setBookingData({
                          ...bookingData,
                          activityEndDate: e,
                        });
                        break;
                    }
                  }
                }}
                format="YYYY-MM-DD"
                minDate={new Date().toISOString().slice(0, 10)}
                style={{
                  display: "block",
                  padding: "15px 10px",
                  width: "100%",
                  marginBottom: "20px",
                }}
              />
            </div>
            <div className="d-flex flex-column">
              <label>
                <b>Expected End Date:</b>
              </label>
              <DatePicker
                mobileLabels={{
                  date: "Date",
                  month: "Month",
                  year: "Year",
                }}
                value={bookingData.activityEndDate || new Date()}
                onChange={(e) =>
                  setBookingData({ ...bookingData, activityEndDate: e })
                }
                format="YYYY-MM-DD"
                minDate={bookingData.activityStartDate}
                style={{
                  display: "block",
                  padding: "15px 10px",
                  width: "100%",
                  marginBottom: "20px",
                }}
                disabled={
                  bookingData.recurrence &&
                  bookingData.recurrence.value === "once"
                }
              />
            </div>
          </div>
          <div className="col-md-5">
            <h4>Available Schedules</h4>
            {/* list react-bootstrap badges of available schedules */}
            <div className="d-flex flex-wrap">
              <i>No selections yet</i>
            </div>
          </div>
        </div>
      )}
      <FormControl
        error={bookingData.error && !bookingData.activityType}
        style={{ width: "100%", zIndex: 9 }}
      >
        <Select
          labelId="activity-type-label"
          id="activity-type"
          options={options}
          value={bookingData.activityType || ""}
          helperText={
            bookingData.error && !bookingData.activityType ? "Required" : ""
          }
          onChange={(selectedOption) =>
            setBookingData({ ...bookingData, activityType: selectedOption })
          }
          placeholder="Select an activity type"
          isSearchable
        />
        <FormHelperText>
          {bookingData.error && !bookingData.activityType ? "Required" : ""}
        </FormHelperText>
      </FormControl>
      {bookingData.activityType &&
        bookingData.activityType.value === "learning" && (
          <FormControl
            error={bookingData.error && !bookingData.activityModule}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <Select
              labelId="activity-module-label"
              id="activity-module"
              options={
                modules.length > 0 &&
                modules.map((module) => {
                  return {
                    value: module._id,
                    label: module.module_name + " (" + module.module_code + ")",
                  };
                })
              }
              value={bookingData.activityModule || ""}
              helperText={
                bookingData.error && !bookingData.activityModule
                  ? "Required"
                  : ""
              }
              onChange={(selectedOption) =>
                setBookingData({
                  ...bookingData,
                  activityModule: selectedOption,
                })
              }
              placeholder="Select an activity module"
              isSearchable
            />
            <FormHelperText>
              {bookingData.error && !bookingData.activityModule
                ? "Required"
                : ""}
            </FormHelperText>
          </FormControl>
        )}
      {bookingData.activityType &&
        bookingData.activityType.value !== "learning" && (
          <TextField
            label="Activity Name"
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
              bookingData.error && !bookingData.activityName ? "Required" : ""
            }
            style={{ width: "100%", marginTop: "20px" }}
          />
        )}
      <TextField
        label="Activity Description"
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
            ? "Required"
            : ""
        }
        margin="normal"
        fullWidth
        multiline
        rows={3}
      />
    </>
  );
};

export default BasicInfo;
