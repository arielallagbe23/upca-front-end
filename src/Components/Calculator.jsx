import React, { useState, useEffect } from 'react';
import './Calculator.css';


const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);


  const handleButtonClick = (value) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  const handleButtonClick2 = (value) => {
    if (value === 'space') {
      setExpression((prevExpression) => prevExpression + ' ');
    } else {
      setExpression((prevExpression) => prevExpression + value);
    }
  };

  const handleClear = () => {
    setExpression((prevExpression) =>
      prevExpression.length > 0 ? prevExpression.slice(0, -1) : prevExpression
    );
  };
  
  const handleClearAll = () => {
    setExpression(''); // Clear the expression
    setResult(''); // Clear the result
    // Additional logic to clear any other state if needed
  };
  
  const handleTogglePower = () => {
    // Toggle the power state, additional logic if needed
  };

  const handleCalculate = () => {
    fetch('http://127.0.0.1:8000/calculate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data.result.toString());
        // Ajouter la nouvelle entrée au début de l'array history
        setHistory((prevHistory) => [data, ...prevHistory]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 6,
  });

  // Mettez à jour votre appel à l'API dans useEffect
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:8000/get_all_data?skip=${(pagination.currentPage - 1) * pagination.pageSize}&limit=${pagination.pageSize}`);
      const data = await response.json();
      setHistory(data);
    };
  
    fetchData();
  }, [pagination]);
  
  // Ajoutez des gestionnaires d'événements pour gérer les changements de page
  const handleNextPage = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      currentPage: prevPagination.currentPage + 1,
    }));
  };
  
  const handlePrevPage = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      currentPage: Math.max(1, prevPagination.currentPage - 1),
    }));
  };
  

  return (

    <div className="grand-div">

      <div className="calculator-container">

      <div className="calculator">

        <input
          type="text"
          placeholder="Enter expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />

        {result && <p>Result: {result}</p>}

        <div className="calculator-buttons">
          <div className="button-row">
            <div className="first-row">
              {[7, 8, 9, '/'].map((value) => (
                <button key={value} onClick={() => handleButtonClick(value)}>
                  {value}
                </button>
              ))}
            </div>
            <div className="first-row">
              {[4, 5, 6, '*'].map((value) => (
                <button key={value} onClick={() => handleButtonClick(value)}>
                  {value}
                </button>
              ))}
            </div>
            <div className="first-row">
              {[1, 2, 3, '-'].map((value) => (
                <button key={value} onClick={() => handleButtonClick(value)}>
                  {value}
                </button>
              ))}
            </div>
            <div className="first-row">
            <button onClick={handleClear} className="special-button">C</button>
              {[0, '.', '+'].map((value) => (
                <button key={value} onClick={() => handleButtonClick(value)}>
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="button-row-2">
            
              <button onClick={handleClearAll} className="special-button">AC</button>
              <button onClick={() => handleButtonClick2('space')} className="special-button">
                _
              </button>
              <button onClick={handleCalculate} className="equals-button">=</button>
          
          </div>

        </div>

      </div>

      </div>


    <div className="table-calcul-container">
      <div className="table-calculs">
        <table>
            <thead>
              <tr>
                <th>Expression</th>
                <th>Result</th>    
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.expression}</td>
                  <td>{item.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      <div className="pagination-buttons">
        <button onClick={handlePrevPage} disabled={pagination.currentPage === 1}>{"\u2190"}</button>
        <button onClick={handleNextPage}>{"\u2192"}</button>
      </div>
    </div>


    </div>

    
  );
};

export default Calculator;
