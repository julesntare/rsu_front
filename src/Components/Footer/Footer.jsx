import React from "react";
import "./Footer.scss";

export default function Footer() {
  let date = new Date();
  const year = date.getFullYear();

  return (
    <div className="footer mt-3 w-100">
      <div className="p-1 d-flex justify-content-center align-items-center px-3 px-lg-5 copy-right">
        <p>Copyrighted RSU {year} | All Rights Reserved</p>
      </div>
    </div>
  );
}
