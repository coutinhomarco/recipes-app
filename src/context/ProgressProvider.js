import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

export default function ProgressProvider({ children }) {
  const [inProgRecipes, setProg] = useState([]);
  const [doneRecipes, setDone] = useState([]);
  useEffect(() => {
    setProg(JSON.parse(localStorage.getItem('inProgressRecipes')));
    setDone(JSON.parse(localStorage.getItem('doneRecipes')));
    console.log(inProgRecipes);
  }, []);
  const CONTEXT_VALUE = {
    inProgRecipesArray: inProgRecipes,
    doneRecipesArray: doneRecipes,
    setProg,
    setDone,
  };
  return (
    <ProgressProvider.Provider value={ CONTEXT_VALUE }>
      {children}
    </ProgressProvider.Provider>
  );
}

ProgressProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
