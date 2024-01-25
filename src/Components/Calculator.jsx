import React, { useState, useEffect } from 'react';
import './Calculator.css';

// Définition du composant Calculator
const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const handleButtonClick = (value) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  // Gestionnaire de clic pour le bouton "espace"
  const handleButtonClick2 = (value) => {
    if (value === 'space') {
      setExpression((prevExpression) => prevExpression + ' ');
    } else {
      setExpression((prevExpression) => prevExpression + value);
    }
  };

  // Gestionnaire de clic pour effacer le dernier caractère de l'expression
  const handleClear = () => {
    setExpression((prevExpression) =>
      prevExpression.length > 0 ? prevExpression.slice(0, -1) : prevExpression
    );
  };
  
  // Gestionnaire de clic pour effacer tout (expression, résultat, historique)
  const handleClearAll = () => {
    setExpression('');
    setResult('');
    setHistory([]);
    // Logique supplémentaire pour effacer d'autres états si nécessaire
  };
  
  // Gestionnaire de clic pour effectuer le calcul et enregistrer dans l'historique
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

  // Utilisation de useEffect pour récupérer les données d'historique depuis le backend
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:8000/get_all_data?skip=${(pagination.currentPage - 1) * pagination.pageSize}&limit=${pagination.pageSize}`);
      const data = await response.json();
      setHistory(data);
    };
  
    fetchData();
  }, [pagination]);
  
  // Gestionnaires d'événements pour changer de page
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

  // Retourner la structure JSX du composant
  return (
    <div className="grand-div">
      <div className="calculator-container">
        <div className="calculator">
          {/* Zone de saisie pour l'expression */}
          <input
            type="text"
            placeholder="Enter expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
          />

          {/* Affichage du résultat */}
          {result && <p>Result: {result}</p>}

          {/* Boutons de la calculatrice */}
          <div className="calculator-buttons">
            <div className="button-row">
              {/* ... (Boucles pour générer les boutons) */}
            </div>
            <div className="button-row-2">
              {/* Boutons spéciaux (C, AC, espace, =) */}
              <button onClick={handleClearAll} className="special-button">AC</button>
              <button onClick={() => handleButtonClick2('space')} className="special-button">
                _
              </button>
              <button onClick={handleCalculate} className="equals-button">=</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des calculs avec pagination */}
      <div className="table-calcul-container">
        <div className="table-calculs">
          <table>
            {/* ... (En-tête du tableau) */}
            <tbody>
              {/* Boucle pour afficher les données de l'historique */}
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.expression}</td>
                  <td>{item.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Boutons de pagination */}
        <div className="pagination-buttons">
          <button onClick={handlePrevPage} disabled={pagination.currentPage === 1}>{"\u2190"}</button>
          <button onClick={handleNextPage}>{"\u2192"}</button>
        </div>
      </div>
    </div>
  );
};

// Exportation du composant Calculator pour pouvoir l'utiliser ailleurs dans l'application
export default Calculator;
