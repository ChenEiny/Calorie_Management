/*
Roy Megidish 209277458
Hen Einy 209533785 
*/
import React, { useState } from 'react';

const FeelingLucky = () => {
  const [meal, setMeal] = useState(null);

  const handleClick = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      if (data && data.meals && data.meals.length > 0) {
        setMeal(data.meals[0]);
      } else {
        setMeal(null);
      }
    } catch (error) {
      console.error('Error fetching meal data:', error);
    }
  };

  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleClick}>Cant Find what to eat?</button>
      {meal && (
        <div>
          <h2>{meal.strMeal}</h2>
          <img src={meal.strMealThumb} alt={meal.strMeal} style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  );
};

export default FeelingLucky;
