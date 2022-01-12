import React from 'react';
import PropTypes from 'prop-types';

export default function Ingredients(props) {
  const { drinkRecipe } = props;
  const allIngredientsArray = drinkRecipe.filter(
    (ingredients) => ingredients[0].includes('strIngredient'),
  );
  const ingredientArray = allIngredientsArray.filter(
    (ingredients) => ingredients[1] !== '' && ingredients[1] !== null,
  );
  const allMeasureArray = drinkRecipe.filter(
    (measure) => measure[0].includes('strMeasure'),
  );
  const measureArray = allMeasureArray.filter(
    (measure) => measure[1] !== null,
  ).map((measure) => measure[1]);

  return (
    <>
      <h4>
        Ingredients:
        { ' ' }
      </h4>
      <ul>
        {
          ingredientArray.map((ingredients, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {`${measureArray[index] || ''} ${ingredients[1]}`}
              { ' ' }
            </li>))
        }
      </ul>
    </>
  );
}

Ingredients.propTypes = {
  drinkRecipe: PropTypes.arrayOf.isRequired,
};
