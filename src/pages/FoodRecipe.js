import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Ingredients from '../components/FoodIngredients';
import { apiMealsRecipe } from '../servicesContext/mealsApi';
import { drinkApiDidMount } from '../servicesContext/drinksAPI';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function FoodRecipe(props) {
  const { match: { params: { id }, url } } = props;
  const [mealRecipe, setMealsRecipe] = useState({});
  const [drink, setDrink] = useState([]);
  const [shareButton, setShareButton] = useState(false);

  const SIX = 6;
  const link = mealRecipe.strYoutube;
  const { idMeal, strArea, strCategory, strMeal, strMealThumb,
    strInstructions } = mealRecipe;

  useEffect(() => {
    apiMealsRecipe(id, setMealsRecipe);
  }, [id, setMealsRecipe]);

  useEffect(() => {
    drinkApiDidMount(setDrink);
  }, [setDrink]);

  function handleShare() {
    setShareButton(true);
    const linkRecipe = `http://localhost:3000${url}`;
    navigator.clipboard.writeText(linkRecipe);
  }

  const favorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
  const favoritesArray = favorites || [];
  const recipe = [{
    id: idMeal,
    type: 'comida',
    area: strArea,
    category: strCategory,
    alcoholicOrNot: '',
    name: strMeal,
    image: strMealThumb,
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
      id: idMeal,
      type: 'comida',
      name: strMeal,
      checks: [],
    }];

    const saveInProgRecipesArray = [...inProgRecipesArray, ...ProgRecipe];
    const saveInProgRecipes = JSON.stringify(saveInProgRecipesArray);
    localStorage.setItem('inProgressRecipes', saveInProgRecipes);
  }

  return (
    <>
      <div className="recipe-details">
        <header />
        <h1 data-testid="recipe-title">
          {strMeal}
        </h1>
        <img
          data-testid="recipe-photo"
          src={ strMealThumb }
          alt={ strMeal }
          className="recipe-photo"
          width="320"
          height="240"
        />
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
        { ' ' }
        <p>{ strCategory }</p>

        <Ingredients mealRecipe={ Object.entries(mealRecipe) } />
        <span data-testid="instructions">
          <h4 className="instruction">Instructions:</h4>
          { ' ' }
          <p id="instructions-p">{ strInstructions }</p>
        </span>
        <iframe
          title="video"
          data-testid="video"
          width="320"
          height="240"
          src={ `https://www.youtube.com/embed/${link !== undefined && link.split('v=')[1]}` }
        >
          Your browser does not support the video tag.
        </iframe>
        <div className="carousel-container">
          <h4>Side Dishes Recommendeds:</h4>
          <br />
          <div className="container">
            <div className="carousel">
              { drink && drink.slice(0, SIX).map((drinks, index) => (
                <div
                  data-testid={ `${index}-recomendation-card` }
                  key={ index }
                  className="item"
                >
                  <div className="image">
                    <img src={ drinks.strDrinkThumb } alt="" />
                  </div>
                  <div className="info">
                    <span
                      data-testid={ `${index}-recomendation-title` }
                      className="name"
                    >
                      { drinks.strDrink }
                    </span>
                  </div>
                </div>
              )) }
            </div>
          </div>
        </div>
      </div>
      <Link to={ `/comidas/${id}/in-progress` }>
        { isDone() ? ''
          : (
            <button
              data-testid="start-recipe-btn"
              type="button"
              id="start-btn"
              className="footer-btns"
              onClick={ handleStartRecipe }
            >
              {isDone() === false && isStart() === true ? 'Continue Recipe'
                : 'Start Recipe' }
            </button>)}
      </Link>
    </>
  );
}

FoodRecipe.propTypes = {
  match: PropTypes.objectOf({
    params: PropTypes.objectOf({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
