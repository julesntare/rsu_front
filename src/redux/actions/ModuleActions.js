import axios from "axios";

export const GET_MODULE = "GET_MODULE";
export const GET_MODULE_BY_ID = "GET_MODULE_BY_ID";
export const CREATE_MODULE = "CREATE_MODULE";
export const DELETE_MODULE = "DELETE_MODULE";
export const MODIFY_MODULE = "MODIFY_MODULE";
export const DELETE_ALL_MODULE = "DELETE_ALL_MODULE";

export const getModule = () => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/modules`)
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_MODULE,
        payload: data,
      });
    });
};

export const deleteModule = (id) => (dispatch) => {
  axios.post("/api/modules/delete", { id }).then((res) => {
    dispatch({
      type: DELETE_MODULE,
      payload: res.data,
    });
  });
};

export const deleteAllModule = () => (dispatch) => {
  axios.post("/api/modules/delete-all").then((res) => {
    dispatch({
      type: DELETE_ALL_MODULE,
      payload: res.data,
    });
  });
};

export const createModule = (data) => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/modules/create`, {
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
      type: CREATE_MODULE,
      payload: res,
    });
  });
};
