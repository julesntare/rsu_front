import axios from "axios";

export const GET_USER = "GET_USER";
export const GET_USER_BY_ID = "GET_USER_BY_ID";
export const CREATE_USER = "CREATE_USER";
export const DELETE_USER = "DELETE_USER";
export const MODIFY_USER = "MODIFY_USER";
export const DELETE_ALL_USER = "DELETE_ALL_USER";

export const getUser = () => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/users/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("rsuToken")}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_USER,
        payload: data,
      });
    });
};

export const getUserByID = (id) => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("rsuToken")}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_USER_BY_ID,
        payload: data,
      });
    });
};

export const deleteUser = (id) => (dispatch) => {
  axios.post("/api/user/delete", { id }).then((res) => {
    dispatch({
      type: DELETE_USER,
      payload: res.data,
    });
  });
};

export const deleteAllUser = () => (dispatch) => {
  axios.post("/api/user/delete-all").then((res) => {
    dispatch({
      type: DELETE_ALL_USER,
      payload: res.data,
    });
  });
};

export const createUser = (data) => (dispatch) => {
  fetch(`${import.meta.env.VITE_RSU_API_URL}/auth/register`, {
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
      type: CREATE_USER,
      payload: res,
    });
  });
};
