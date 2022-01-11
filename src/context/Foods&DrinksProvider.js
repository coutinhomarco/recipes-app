import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DrinksAndFoodsContext from './Foods&Drinks';

function Provider({ children }) {
  const [meals, setMeals] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [recipeComplete, setRecipeComplete] = useState(false);
  const inProgRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const favoritesArray = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
  const [favorites, setFavorites] = useState(favoritesArray);
  const [isChecked, setIsChecked] = useState([]);

  const contextValue = {
    meals,
    setMeals,
    drinks,
    setDrinks,
    favoritesArray,
    favorites,
    setFavorites,
    recipeComplete,
    setRecipeComplete,
    isChecked,
    setIsChecked,
    inProgRecipes,
  };

  return (
    <DrinksAndFoodsContext.Provider value={ contextValue }>
      {children}
    </DrinksAndFoodsContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Provider;
