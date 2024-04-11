async function getRecipeById(id) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  displayRecipe(data.meals[0]);
}

function displayRecipe(recipe) {
  let recipeContainer = document.querySelector('.recipe');
  let html = `
      <h2>${recipe.strMeal}</h2>
      <h3>Ingredients</h3>
      <ul class="recipe">
  `;
  
  for (let i = 1; i <= 20; i++) {
    let ingredient = recipe[`strIngredient${i}`];
    let measure = recipe[`strMeasure${i}`];
    if (ingredient && measure) {
      html += `<li>${measure} ${ingredient}</li>`;
    }
  }

  html += `
      </ul>
      <p>${recipe.strInstructions}</p>
      <a href="${recipe.strYouTube}">YouTube Link</a>
      <a href="${recipe.strSource}">Source Link</a>
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
  `;
  console.log(recipe);
  recipeContainer.innerHTML = html;
  
}

async function getRandom() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const data = await response.json();
  displayRandom(data.meals);
}

function displayRandom(meals) {
  let randomContainer = document.querySelector('#random');
  let html = '';

  for (let meal of meals) {
    html += `
      <button class="button-card" onclick="getRecipeById('${meal.idMeal}')">
        <img src="${meal.strMealThumb}" class="meal-image">
        <div class="meal-name">${meal.strMeal}</div>
      </button>`;
  }

  randomContainer.innerHTML = html;

  let randomButton = document.createElement('button');
  randomButton.textContent = 'Get Another Random Recipe';
  randomButton.onclick = getRandom;
  randomContainer.appendChild(randomButton);

}



async function getCategories() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await response.json();
  displayCategories(data.categories);
}

function displayCategories(categories) {
  let categoryContainer = document.querySelector('#categories');
  let html = '';
  for (let category of categories) {
      html += `<button class="button-card" onclick="getMealsByCategory('${category.strCategory}')">
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="category-image">
            <div class="category-name">${category.strCategory}</div>
        </button>`;
  }
  categoryContainer.innerHTML = html;
}

async function getMealsByCategory(category) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await response.json();
  displayMeals(data.meals);
}

async function getCuisines() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const data = await response.json();
  displayCuisine(data.meals);
}

function displayCuisine(cuisines) {
  let cuisineContainer = document.querySelector('#cuisines');
  let html = '';
  for (let cuisine of cuisines) {
      html += `<button class="button-card" onclick="getMealsByCuisine('${cuisine.strArea}')">${cuisine.strArea}</button>`;
  }
  cuisineContainer.innerHTML = html;
}

async function getMealsByCuisine(cuisine) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`);
  const data = await response.json();
  displayMeals(data.meals);
}

function displayMeals(meals) {
  let resultContainer = document.querySelector('.result');
  let html = '';
  for (let meal of meals) {
      html += `<div class="button-card">
          <p>${meal.strMeal}</p>
          <div>
              <img src="${meal.strMealThumb}">
          </div>
          <button onclick="getRecipeById('${meal.idMeal}')">Get Recipe </button>
      </div>`;
  }
  resultContainer.innerHTML = html;
}

function searchByIngredient() {
    const searchKey = document.getElementById('searchKey').value;
    getMealsByIngredient(searchKey)
        .then(meals => {
            if (meals) {
                console.log('Found meals:', meals);
                displayMeals(meals); 
            } else {
                console.log('No meals found for the specified ingredient.');
            }
        });
}

async function getMealsByIngredient(ingredient) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();

        if (data.meals) {
            return data.meals;
        } else {
            throw new Error('No meals found for the specified ingredient.');
        }
    } catch (error) {
        console.error('Error fetching meals by ingredient:', error.message);
        return null;
    }
}

getCategories();
getCuisines();
getRandom();

