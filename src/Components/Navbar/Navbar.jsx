import React, { useEffect, useLayoutEffect, useState } from "react";
import "./Navbar.scss";
import AppLogo from "../../assets/logo/app-logo2.png";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import RoundedNameAvatar from "../utils/RoundedNameAvatar";
import useAuth from "../../hooks/useAuth";

export default function NavBar() {
  const { user, isAuthenticated } = useAuth();
  const [loggedIn, setLoggedIn] = useState(true); // check if the user has logged in
  const [hideFilter, setHideFilter] = useState(true);
  const handleHideFilter = () => {
    setHideFilter(false);
  };

  useEffect(() => {
    setLoggedIn(isAuthenticated);
  }, [user, isAuthenticated]);

  //get rid of filters in some nav links
  let locationPath = window.location.pathname;
  useLayoutEffect(() => {
    if (
      locationPath === "/" ||
      locationPath === "/maps" ||
      locationPath === "/timetable" ||
      locationPath === "/enquiry"
    ) {
      setHideFilter(false);
    }
  }, []);
  const showFilter = () => {
    setHideFilter(true);
  };
  return (
    <>
      <Navbar
        bg="bg-white"
        expand="lg"
        className="nav-web text-black text-bold px-3 d-flex justify-content-between mt-0 mb-1"
      >
        <Link to="/" onClick={handleHideFilter}>
          <img
            alt=""
            style={{ width: "50px", height: "50px" }}
            src={AppLogo}
            className="d-inline-block align-top me-lg-5 rounded-pill mg-fluid"
          />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <li className="nav-item ms-3 ms-xl-5">
              <ActiveLink to="/buildings" onClick={handleHideFilter}>
                Buildings
              </ActiveLink>
            </li>
            <li className="nav-item ms-3 ms-xxl-5">
              <ActiveLink to="/allrooms" onClick={showFilter}>
                Rooms
              </ActiveLink>
            </li>
            <li className="nav-item ms-3 ms-xxl-5">
              <ActiveLink to="/bookings" onClick={showFilter}>
                Booking
              </ActiveLink>
            </li>
            <li className="nav-item ms-3 ms-xxl-5">
              <ActiveLink to="/maps" onClick={handleHideFilter}>
                Maps
              </ActiveLink>
            </li>
            <li className="nav-item ms-3  me-auto ms-xxl-5 ">
              <ActiveLink to="/enquiry" onClick={handleHideFilter}>
                Enquiry
              </ActiveLink>
            </li>
            <li className="nav-item  ms-lg-5">
              {!loggedIn ? (
                <button className=" text-white btn-login">
                  <ActiveLink to="/login">Login</ActiveLink>
                </button>
              ) : (
                <RoundedNameAvatar name={user ? user.fullname : "N A"} />
              )}
            </li>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
const ActiveLink = ({ to, children, ...props }) => {
  const truePath = useResolvedPath(to);
  const isActive = useMatch({ path: truePath.pathname, end: true });
  return (
    <Link
      className={isActive ? "nav-link active" : "nav-link"}
      to={to}
      {...props}
    >
      {children}{" "}
    </Link>
  );
};
