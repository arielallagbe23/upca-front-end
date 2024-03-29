import React, { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import "./Calculator.css";

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleButtonClick = (value) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  const handleButtonClick2 = (value) => {
    if (value === "space") {
      setExpression((prevExpression) => prevExpression + " ");
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
    setExpression("");
    setResult("");
  };

  const handleCalculate = () => {
    setLoading(true);
  
    fetch("http://127.0.0.1:8000/calculate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expression }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setError("Impossible de diviser par zéro !");
          setResult("");
        } else {
          setResult(data.result.toString());
          fetchData();
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setError("Une erreur inattendue s'est produite.");
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setError(null);
        }, 3000);
      });
  };
  
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 6,
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://127.0.0.1:8000/get_all_data?skip=${(pagination.currentPage - 1) * pagination.pageSize}&limit=${pagination.pageSize}`
      );
      const data = await response.json();
      console.log("Data:", data);
      setTimeout(() => {
        setHistory(data);
        console.log("History:", data);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur :", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

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
            onChange={(e) => {
              setExpression(e.target.value);
              setError(null); 
            }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}

          {result && <p>Result: {result}</p>}

          <div className="calculator-buttons">
            <div className="button-row">
              <div className="first-row">
                {[7, 8, 9, "/"].map((value) => (
                  <button key={value} onClick={() => handleButtonClick(value)}>
                    {value}
                  </button>
                ))}
              </div>
              <div className="first-row">
                {[4, 5, 6, "*"].map((value) => (
                  <button key={value} onClick={() => handleButtonClick(value)}>
                    {value}
                  </button>
                ))}
              </div>
              <div className="first-row">
                {[1, 2, 3, "-"].map((value) => (
                  <button key={value} onClick={() => handleButtonClick(value)}>
                    {value}
                  </button>
                ))}
              </div>
              <div className="first-row">
                <button onClick={handleClear} className="special-button">
                  C
                </button>
                {[0, ".", "+"].map((value) => (
                  <button key={value} onClick={() => handleButtonClick(value)}>
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="button-row-2">
              <button onClick={handleClearAll} className="special-button">
                AC
              </button>
              <button
                onClick={() => handleButtonClick2("space")}
                className="special-button"
              >
                _
              </button>
              <button onClick={handleCalculate} className="equals-button">
                =
              </button>
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
              {loading ? (
                <tr className="loading-row">
                  {[...Array(2)].map((_, index) => (
                    <td key={index} className="loading-cell" colSpan="">
                      <div className="this-one">
                        <BarLoader
                          color={"#073763"}
                          loading={loading}
                          height={4}
                          width={55}
                          radius={100}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ) : (
                history.length === 0 && (
                  <tr className="no-data-row">
                    <td colSpan="2">Aucune donnée disponible pour le moment</td>
                  </tr>
                )
              )}

              {!loading &&
                history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.expression}</td>
                    <td>{item.result}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-buttons">
          <button
            onClick={handlePrevPage}
            disabled={pagination.currentPage === 1}
          >
            {"\u2190"}
          </button>
          <button onClick={handleNextPage}>{"\u2192"}</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
