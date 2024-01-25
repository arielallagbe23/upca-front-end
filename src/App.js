import './App.css';

import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import Navbar from './Components/Navbar.jsx'
import Calculator from './Components/Calculator.jsx';
import DataExport from './Components/DataExport.jsx';


function App() {
  return (
    <div className="App">
      <Navbar />

        <div className="content">
          <Calculator />
          <DataExport />
        </div>

    </div>
  );
}

export default App;
