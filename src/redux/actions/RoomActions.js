import axios from "axios";

export const GET_ROOM = "GET_ROOM";
export const GET_ROOM_BY_ID = "GET_ROOM_BY_ID";
export const GET_ROOMS_BY_BUILDING_ID = "GET_ROOMS_BY_BUILDING_ID";
export const CREATE_ROOM = "CREATE_ROOM";
export const DELETE_ROOM = "DELETE_ROOM";
export const MODIFY_ROOM = "MODIFY_ROOM";
export const DELETE_ALL_ROOM = "DELETE_ALL_ROOM";

export const getRoom = () => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/rooms/all`)
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_ROOM,
        payload: data,
      });
    });
};

export const getBuildingByID = (id) => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/rooms/${id}`)
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_ROOM_BY_ID,
        payload: data,
      });
    });
};

export const getRoomsByBuildingID = (id) => (dispatch) => {
  // filter via redux fetched rooms by building id
  fetch(`${import.meta.env.VITE_RSU_API_URL}/rooms/all`)
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_ROOMS_BY_BUILDING_ID,
        payload: data.filter((room) => room.room_building._id === id),
      });
    });
};

export const deleteRoom = (id) => (dispatch) => {
  axios.post("/api/rooms/delete", { id }).then((res) => {
    dispatch({
      type: DELETE_ROOM,
      payload: res.data,
    });
  });
};

export const deleteAllRoom = () => (dispatch) => {
  axios.post("/api/rooms/delete-all").then((res) => {
    dispatch({
      type: DELETE_ALL_ROOM,
      payload: res.data,
    });
  });
};

export const createRoom = (data) => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/rooms/create`, {
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
      type: CREATE_ROOM,
      payload: res,
    });
  });
};
