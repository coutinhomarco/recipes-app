import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import DrinksAndFoodsContext from '../context/Foods&Drinks';

export default function Ingredients(props) {
  const { ingredientArray, measureArray,
    idMeal, strMeal, id } = props;
  const { isChecked, setIsChecked, inProgRecipes } = useContext(DrinksAndFoodsContext);

  const inProgRecipesArray = inProgRecipes || [];
  /*   const recipeObject = inProgRecipesArray.find((recipe) => recipe.id === id);
  const checksArray = recipeObject ? recipeObject.checks : [];
  console.log(checksArray); */

  function checks(ingredients) {
    setIsChecked([...isChecked, ingredients[1]]);
    const removeFromArray = inProgRecipesArray.filter((item) => item.id !== id);

    const ProgRecipe = [{
      id: idMeal,
      type: 'comida',
      name: strMeal,
      checks: isChecked,
    }];

    const saveInProgRecipesArray = [...removeFromArray, ...ProgRecipe];
    const saveInProgRecipes = JSON.stringify(saveInProgRecipesArray);
    localStorage.setItem('inProgressRecipes', saveInProgRecipes);
  }

  return (
    <>
      <span>
        <p>Ingredients:</p>
      </span>
      <ul>
        {
          ingredientArray && ingredientArray.map((ingredients, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-step` }
            >
              {`${measureArray[index][1]} ${ingredients[1]}`}
              { ' ' }
              <input
                type="checkbox"
                onClick={ () => checks(ingredients) }
                checked={ isChecked.includes(ingredients[1]) }
              />
            </li>))
        }
      </ul>
    </>
  );
}

Ingredients.propTypes = {
  measureArray: PropTypes.arrayOf,
  ingredientArray: PropTypes.arrayOf,
  isChecked: PropTypes.arrayOf,
  id: PropTypes.string,
}.isRequired;
