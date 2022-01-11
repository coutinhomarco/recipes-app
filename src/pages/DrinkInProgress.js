import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { apiDrinksRecipe } from '../servicesContext/drinksAPI';
import Ingredients from '../components/DrinkIngredientsInProgr';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function DrinkInProgress(props) {
  const { match: { params: { id } } } = props;
  const [drinkRecipe, setDrinkRecipe] = useState({});
  const [shareButton, setShareButton] = useState(false);
  const [isChecked, setIsChecked] = useState([]);

  const history = useHistory();

  const { idDrink, strCategory, strAlcoholic, strDrink, strDrinkThumb,
    strInstructions } = drinkRecipe;

  const ingredientArray = Object.entries(drinkRecipe).filter(
    (ingredients) => ingredients[0].includes('strIngredient'),
  ).filter((ingredients) => ingredients[1] !== '' && ingredients[1] !== null);

  const measureArray = Object.entries(drinkRecipe).filter(
    (measure) => measure[0].includes('strMeasure'),
  ).filter((measure) => measure[1] !== ' ');

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
    apiDrinksRecipe(id, setDrinkRecipe);
  }, [id, setDrinkRecipe]);

  function handleShare() {
    setShareButton(true);
    const linkRecipe = `http://localhost:3000/bebidas/${id}`;
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
  const ProgRecipe = [{
    id: idDrink,
    type: 'bebida',
    name: strDrink,
    // checks: isChecked,
  }];

  const saveInProgRecipesArray = [...inProgRecipesArray, ...ProgRecipe];
  const saveInProgRecipes = JSON.stringify(saveInProgRecipesArray);
  localStorage.setItem('inProgressRecipes', saveInProgRecipes);

  function handleRecipeComplete() {
    const removeInProgress = inProgRecipesArray.filter((item) => item.id !== id);
    const removedArray = JSON.stringify(removeInProgress);
    localStorage.setItem('inProgressRecipes', removedArray);

    const doneRecipe = [{
      id: idDrink,
      type: 'bebida',
      area: '',
      category: strCategory,
      alcoholicOrNot: strAlcoholic,
      name: strDrink,
      image: strDrinkThumb,
      doneDate: getDoneDate(),
      tags: [],
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
        {strDrink}
      </h1>
      <img
        data-testid="recipe-photo"
        src={ strDrinkThumb }
        alt="foto da bebida"
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
        {strAlcoholic}
      </span>
      <Ingredients
        measureArray={ measureArray }
        ingredientArray={ ingredientArray }
        isChecked={ isChecked }
        setIsChecked={ setIsChecked }
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

DrinkInProgress.propTypes = {
  match: PropTypes.objectOf({
    params: PropTypes.objectOf({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
