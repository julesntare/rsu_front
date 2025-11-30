import axios from "axios";

export const GET_BUILDING = "GET_BUILDING";
export const GET_BUILDING_BY_ID = "GET_BUILDING_BY_ID";
export const CREATE_BUILDING = "CREATE_BUILDING";
export const DELETE_BUILDING = "DELETE_BUILDING";
export const MODIFY_BUILDING = "MODIFY_BUILDING";
export const DELETE_ALL_BUILDING = "DELETE_ALL_BUILDING";

export const getBuilding = () => (dispatch) => {
  return fetch(`${import.meta.env.VITE_RSU_API_URL}/building/all`)
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_BUILDING,
        payload: data,
      });
      return data;
    });
};

export const getBuildingByID = (id) => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/building/${id}`)
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_BUILDING_BY_ID,
        payload: data,
      });
    });
};

export const deleteBuilding = (id) => (dispatch) => {
  axios.post("/api/building/delete", { id }).then((res) => {
    dispatch({
      type: DELETE_BUILDING,
      payload: res.data,
    });
  });
};

export const deleteAllBuilding = () => (dispatch) => {
  axios.post("/api/building/delete-all").then((res) => {
    dispatch({
      type: DELETE_ALL_BUILDING,
      payload: res.data,
    });
  });
};

export const createBuilding = (data) => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/building`, {
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
      type: CREATE_BUILDING,
      payload: res,
    });
  });
};
