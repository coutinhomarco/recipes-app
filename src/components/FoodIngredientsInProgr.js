import React from 'react';
import PropTypes from 'prop-types';

export default function Ingredients(props) {
  const { mealRecipe } = props;
  const allIngredientsArray = mealRecipe.filter(
    (ingredients) => ingredients[0].includes('strIngredient'),
  );
  const ingredientArray = allIngredientsArray.filter(
    (ingredients) => ingredients[1] !== '' && ingredients[1] !== null,
  );
  const allMeasureArray = mealRecipe.filter(
    (measure) => measure[0].includes('strMeasure'),
  );
  const measureArray = allMeasureArray.filter(
    (measure) => measure[1] !== ' ',
  );

  return (
    <>
      <span>
        Ingredients:
        { ' ' }
      </span>
      <ol>
        {
          ingredientArray.map((ingredients, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-step` }
            >
              {`${measureArray[index][1]} ${ingredients[1]}`}
              { ' ' }
              <input type="checkbox" />
            </li>))
        }
      </ol>
    </>
  );
}

Ingredients.propTypes = {
  mealRecipe: PropTypes.arrayOf.isRequired,
};