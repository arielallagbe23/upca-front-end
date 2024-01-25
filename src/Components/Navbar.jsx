import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "./Navbar.css";

function Navbar() {

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="navbar-brand">  
          NPI
      </div>
    </nav>
  );
}

export default Navbar;
