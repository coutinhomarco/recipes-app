import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import DrinksAndFoodsContext from '../context/Foods&Drinks';
import { apiMealsRecipe } from '../servicesContext/mealsApi';
import Ingredients from '../components/FoodIngredientsInProgr';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function FoodInProgress(props) {
  const { match: { params: { id } } } = props;
  const [mealRecipe, setMealsRecipe] = useState({});
  const [shareButton, setShareButton] = useState(false);
  const { isChecked } = useContext(DrinksAndFoodsContext);

  const history = useHistory();

  const { idMeal, strArea, strCategory, strMeal, strMealThumb,
    strInstructions, strTags } = mealRecipe;

  const ingredientArray = Object.entries(mealRecipe).filter(
    (ingredients) => ingredients[0].includes('strIngredient'),
  ).filter((ingredients) => ingredients[1] !== '' && ingredients[1] !== null);

  const measureArray = Object.entries(mealRecipe).filter(
    (measure) => measure[0].includes('strMeasure'),
  ).filter((measure) => measure[1] !== ' ');

  const tagNames = !strTags ? [] : strTags.split(',');

  function getDoneDate() {
    const DEZ = 10;
    const date = new Date();
    const day = date.getDate();
    const m = date.getMonth() + 1;
    const month = m < DEZ ? `0${m}` : m;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    apiMealsRecipe(id, setMealsRecipe);
  }, [id, setMealsRecipe]);

  function handleShare() {
    setShareButton(true);
    const linkRecipe = `http://localhost:3000/comidas/${id}`;
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

  function handleRecipeComplete() {
    const removeInProgress = inProgRecipesArray.filter((item) => item.id !== id);
    const removedArray = JSON.stringify(removeInProgress);
    localStorage.setItem('inProgressRecipes', removedArray);

    const doneRecipe = [{
      id: idMeal,
      type: 'comida',
      area: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
      doneDate: getDoneDate(),
      tags: tagNames,
    }];
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    const doneRecipesArray = doneRecipes || [];
    localStorage.setItem('doneRecipes',
      JSON.stringify([...doneRecipesArray, ...doneRecipe]));

    history.push('/receitas-feitas');
  }

  return (
    <div className="recipe-details">
      <h1 data-testid="recipe-title">
        {strMeal}
      </h1>
      <img
        data-testid="recipe-photo"
        src={ strMealThumb }
        alt="foto da comida"
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
      <span data-testid="recipe-category">
        Category:
        { ' ' }
        {strCategory}
      </span>
      <Ingredients
        id={ id }
        measureArray={ measureArray }
        ingredientArray={ ingredientArray }
        idMeal={ idMeal }
        strMeal={ strMeal }
      />
      <span data-testid="instructions">
        Instructions:
        { ' ' }
        { strInstructions }
      </span>
      <button
        data-testid="finish-recipe-btn"
        type="button"
        id="finish-btn"
        className="footer-btns"
        onClick={ handleRecipeComplete }
        disabled={ isChecked.length !== ingredientArray.length }
      >
        Finish Recipe
      </button>
    </div>
  );
}

FoodInProgress.propTypes = {
  match: PropTypes.objectOf({
    params: PropTypes.objectOf({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
