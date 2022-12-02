import React, { useLayoutEffect, useState } from "react";
import "./Navbar.scss";
import Logo from "../../assets/logo/urLogo.png";
import {Link, useMatch, useResolvedPath} from "react-router-dom" ;
import Filter from '../Filter/Filter';
import { type } from "@testing-library/user-event/dist/type";

export default function NavBar  () {
  const [logedIn, setLogedIn] =useState(true); // check if the user has logged in
  const [hideFilter, setHideFilter] =useState(true);
  const handleHideFilter =()=>{
    setHideFilter(false);
  }
  //get rid of filters in some nav links
  let locationPath = window.location.pathname;
  useLayoutEffect(()=>{
    if(locationPath === "/" || locationPath === "/maps" || locationPath === "/timetable" || locationPath ==="/enquiry" ){
      setHideFilter(false);
    }
  },[]);
const showFilter = ()=>{
  setHideFilter(true);
}
    return (
        <div>
        <nav className="navbar navbar-expand-lg nav-web text-white px-3 d-flex justify-content-between  mt-0 mb-1">
          <Link to="/" onClick={handleHideFilter}>
              <img
                alt=""
                width="50px"
                height ="50px"
                src={Logo}
                className="d-inline-block align-top me-lg-5 rounded-pill mg-fluid "
              />
          </Link>
          <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
            {/* <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button> */}
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <ul className="navbar-nav  ps-lg-5 w-100 d-flex">
                  <li className="nav-item ms-3 ms-xl-5" >
                    <ActiveLink to ="/" onClick={handleHideFilter}>Home</ActiveLink>
                  </li>
                  <li className="nav-item ms-3 ms-xxl-5" >
                    <ActiveLink to ="/allrooms" onClick={showFilter}>Rooms</ActiveLink>
                  </li>
                  <li className="nav-item ms-3 ms-xxl-5">
                    <ActiveLink to ="/timetable" onClick={handleHideFilter}>Timetable</ActiveLink>
                  </li>
                  <li className="nav-item ms-3 ms-xxl-5" >
                    <ActiveLink to ="/bookings" onClick={showFilter}>Bookings</ActiveLink>
                  </li>
                  <li className="nav-item ms-3 ms-xxl-5">
                    <ActiveLink to ="/maps"  onClick={handleHideFilter}>Maps</ActiveLink>
                  </li>
                  <li className="nav-item ms-3  me-auto ms-xxl-5 " >
                    <ActiveLink to ="/enquiry" onClick={handleHideFilter}>Enquiry</ActiveLink>
                  </li>
                  <li className="nav-item  ms-auto">
                    <button className=" text-white btn-login">
                      <ActiveLink to ="/login">
                        {logedIn? "Login " : <i className="bi ms-1 bi-person-circle"></i>}
                      </ActiveLink>
                    </button>
                  </li>
                </ul>
          </div>
        </nav>
        {hideFilter && 
      <Filter />
        }
    </div>
    )
  }
  //  
const ActiveLink = ({to, children, ...props})=>{
  const truePath = useResolvedPath(to);
  const isActive = useMatch({path: truePath.pathname, end: true});
  return <Link className={isActive?"nav-link active" : "nav-link" } to={to} {...props}>{children} </Link> 
}
