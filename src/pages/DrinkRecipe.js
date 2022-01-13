import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Ingredients from '../components/DrinkIngredients';
import { apiDrinksRecipe } from '../servicesContext/drinksAPI';
import { apiMealsDidMount } from '../servicesContext/mealsApi';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function DrinkRecipe(props) {
  const { match: { params: { id }, url } } = props;
  const [drinkRecipe, setDrinkRecipe] = useState({});
  const [meals, setMeals] = useState([]);
  const [shareButton, setShareButton] = useState(false);

  const SIX = 6;
  const { idDrink, strCategory, strAlcoholic, strDrink, strDrinkThumb,
    strInstructions } = drinkRecipe;

  useEffect(() => {
    apiDrinksRecipe(id, setDrinkRecipe);
  }, [id, setDrinkRecipe]);

  useEffect(() => {
    apiMealsDidMount(setMeals);
  }, [setMeals]);

  function handleShare() {
    setShareButton(true);
    const linkRecipe = `http://localhost:3000${url}`;
    navigator.clipboard.writeText(linkRecipe);
  }

  const favorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
  const favoritesArray = favorites || [];
  const recipe = [{
    id: idDrink,
    type: 'bebida',
    area: '',
    category: strCategory,
    alcoholicOrNot: strAlcoholic,
    name: strDrink,
    image: strDrinkThumb,
  }];
  const saveArray = [...favoritesArray, ...recipe];
  const saveRecipes = JSON.stringify(saveArray);
  const removeFromArray = favoritesArray.filter((favorite) => favorite.id !== id);
  const removedRecipe = JSON.stringify(removeFromArray);

  function isFavorite() {
    return favoritesArray.some((favorite) => favorite.id === id);
  }
  const [favoriteButton, setFavoriteButton] = useState(isFavorite());

  function handleFavorite() {
    if (!favoriteButton) {
      localStorage.setItem('favoriteRecipes', saveRecipes);
    } else localStorage.setItem('favoriteRecipes', removedRecipe);
    setFavoriteButton(!favoriteButton);
  }

  //

  const inProgRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const inProgRecipesArray = inProgRecipes || [];
  const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
  const doneRecipesArray = doneRecipes || [];

  function isStart() {
    return inProgRecipesArray.some((item) => item.id === id);
  }

  function isDone() {
    return doneRecipesArray.some((item) => item.id === id);
  }

  function handleStartRecipe() {
    const ProgRecipe = [{
      id: idDrink,
      type: 'bebida',
      name: strDrink,
      checks: [],
    }];

    const saveInProgRecipesArray = [...inProgRecipesArray, ...ProgRecipe];
    const saveInProgRecipes = JSON.stringify(saveInProgRecipesArray);
    localStorage.setItem('inProgressRecipes', saveInProgRecipes);
  }

  return (
    <div className="recipe-details">
      <header />
      <h1 data-testid="recipe-title">
        {strDrink}
      </h1>
      <img
        data-testid="recipe-photo"
        src={ strDrinkThumb }
        alt="foto da bebida"
        width="320"
        height="240"
      />
      <br />
      <div>
        <button
          type="button"
          id="share-btn"
          data-testid="share-btn"
          onClick={ handleShare }
        >
          <img src={ shareIcon } alt="Share Icon" />
        </button>
        {shareButton && <span>Link copiado!</span>}
        <button
          type="button"
          id="favorite-btn"
          onClick={ handleFavorite }
          src={ favoriteButton ? { blackHeartIcon } : { whiteHeartIcon } }
        >
          { favoriteButton
            ? (
              <img
                data-testid="favorite-btn"
                src={ blackHeartIcon }
                alt="Black Heart Icon"
                width="26px"
              />)
            : (
              <img
                data-testid="favorite-btn"
                src={ whiteHeartIcon }
                alt="White Heart Icon"
              />)}
        </button>
      </div>
      <h4 data-testid="recipe-category">
        Category:
      </h4>
      <p>{strAlcoholic}</p>

      <Ingredients drinkRecipe={ Object.entries(drinkRecipe) } />
      <span data-testid="instructions">
        <h4 className="instruction">Instructions:</h4>
        <p id="instructions-p">{ strInstructions }</p>
      </span>
      <div className="carousel-container">
        <h4>Side Meals Recommendeds:</h4>
        <div className="container">
          <div className="carousel">
            { meals && meals.slice(0, SIX).map((meal, index) => (
              <div
                data-testid={ `${index}-recomendation-card` }
                key={ meal.idMeal }
                className="item"
              >
                <div className="image">
                  <img src={ meal.strMealThumb } alt="" />
                </div>
                <div className="info">
                  <span
                    data-testid={ `${index}-recomendation-title` }
                    className="name"
                  >
                    { meal.strMeal }
                  </span>
                </div>
              </div>
            )) }
          </div>
        </div>
      </div>
      <Link to={ `/bebidas/${id}/in-progress` }>
        { isDone() ? ''
          : (
            <button
              data-testid="start-recipe-btn"
              type="button"
              id="start-btn"
              onClick={ handleStartRecipe }
              className="footer-btns"
            >
              {isDone() === false && isStart() === true ? 'Continue Recipe'
                : 'Start Recipe' }
            </button>)}
      </Link>
    </div>
  );
}

DrinkRecipe.propTypes = {
  match: PropTypes.objectOf({
    params: PropTypes.objectOf({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
