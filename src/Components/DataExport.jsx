import React, { useState } from 'react';
import "./DataExport.css";

const DataExport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    // Assurez-vous que les dates sont au format ISO
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    // Construisez l'URL avec les dates formatées
    const exportUrl = `http://127.0.0.1:8000/export/csv/?start_time=${formattedStartDate}&end_time=${formattedEndDate}`;

    // Ouvrez une nouvelle fenêtre avec l'URL pour télécharger le fichier CSV
    window.open(exportUrl, '_blank');
  };

  return (
    <div className="form-data-export">

    <div className="title">Export Calcul</div>

      <label htmlFor="startDate">Start Date:</label>
      <input
        type="datetime-local"
        id="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label htmlFor="endDate">End Date:</label>
      <input
        type="datetime-local"
        id="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button onClick={handleExport}>Export CSV</button>
    </div>
  );
};

export default DataExport;
