import React from "react";
import { Dropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../Navbar/Navbar.scss";

const getInitials = (name) => {
  const initials = name.split(" ").map((word) => word[0].toUpperCase());
  return initials.join("");
};

const getAvatarColor = (initials) => {
  // Generate a random color based on the initials
  // You can use a hash function to map the initials to a color
  const color =
    "#" +
    (
      (initials.charCodeAt(0) * initials.charCodeAt(1)) % 0xffffff |
      0x000000
    ).toString(16);
  return color;
};

const RoundedNameAvatar = ({ name }) => {
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(initials);
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    navigate("/login");
  };

  return (
    // make dropown menu on avatar
    <Dropdown>
      <Dropdown.Toggle
        as={Button}
        variant="secondary"
        id="dropdown-basic"
        style={{
          backgroundColor: avatarColor,
          borderRadius: "50%",
          padding: "3px 9px",
          fontWeight: "bolder",
          fontSize: "20px",
          border: "none",
          outline: "none",
        }}
      >
        {initials}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Dashboard</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Profile</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RoundedNameAvatar;
