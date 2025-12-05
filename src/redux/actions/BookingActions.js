import axios from "axios";

export const GET_BOOKING = "GET_BOOKING";
export const GET_BOOKING_BY_ID = "GET_BOOKING_BY_ID";
export const CREATE_BOOKING = "CREATE_BOOKING";
export const DELETE_BOOKING = "DELETE_BOOKING";
export const MODIFY_BOOKING = "MODIFY_BOOKING";
export const DELETE_ALL_BOOKING = "DELETE_ALL_BOOKING";

export const getBooking = () => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/bookings/any`)
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_BOOKING,
        payload: data,
      });
    });
};

export const deleteBooking = (id) => (dispatch) => {
  axios.post("/api/bookings/delete", { id }).then((res) => {
    dispatch({
      type: DELETE_BOOKING,
      payload: res.data,
    });
  });
};

export const deleteAllBooking = () => (dispatch) => {
  axios.post("/api/bookings/delete-all").then((res) => {
    dispatch({
      type: DELETE_ALL_BOOKING,
      payload: res.data,
    });
  });
};

export const createBooking = (data) => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/bookings/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("rsuToken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
    }),
  }).then((res) => {
    dispatch({
      type: CREATE_BOOKING,
      payload: res,
    });
  });
};
