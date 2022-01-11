import React, { useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/DoneCards';

export default function FavoriteRecipes() {
  const doneArray = JSON.parse(localStorage.getItem('doneRecipes')) || [];
  const [done, setDone] = useState(doneArray);

  function showAll() {
    setDone(doneArray);
  }

  function justFood() {
    const justFoodArray = doneArray.filter((favorite) => favorite.type === 'comida');
    setDone(justFoodArray);
  }
  function justDrinks() {
    const justDrinksArray = doneArray
      .filter((favorite) => favorite.type === 'bebida');
    setDone(justDrinksArray);
  }

  return (
    <>
      <Header title="Receitas Feitas" />
      <div className="categories-btns">
        <button
          type="button"
          className="category-btn"
          data-testid="filter-by-all-btn"
          onClick={ showAll }
        >
          All
        </button>
        <button
          type="button"
          className="category-btn"
          data-testid="filter-by-food-btn"
          onClick={ justFood }
        >
          Food
        </button>
        <button
          type="button"
          className="category-btn"
          data-testid="filter-by-drink-btn"
          onClick={ justDrinks }
        >
          Drinks
        </button>
      </div>
      {
        done && (done.map((recipe, index) => (
          <Cards
            key={ recipe.id }
            index={ index }
            alcoholicOrNot={ recipe.alcoholicOrNot }
            area={ recipe.area }
            category={ recipe.category }
            date={ recipe.doneDate }
            id={ recipe.id }
            image={ recipe.image }
            name={ recipe.name }
            tags={ recipe.tags }
            type={ recipe.type }
          />
        )))
      }
    </>
  );
}
