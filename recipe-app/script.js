const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");

const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  const respData = await resp.json();
  const randomMeal = respData.meals[0];
  // console.log(randomMeal);
  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const respData = await resp.json();
  const meal = respData.meals[0];

  return meal;
}

async function getMealsBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  const respData = await resp.json();
  const meals = respData.meals;

  return meals;
}

function addMeal(mealData, random = false) {
  // console.log(mealData);
  
  const meal = document.createElement('div');
  meal.classList.add('meal');

  meal.innerHTML = `
    <div class="meal-header">
      ${
        random ?
        `<span class="random">Random Recipe</span>`
        : ''
      }
      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
      <h4>${mealData.strMeal}</h4>
      <button class="fav-btn">
        <i class="fas fa-heart"></i>
      </button>
    </div>
  `;

  const btn = meal.querySelector('.meal-body .fav-btn');

  btn.addEventListener("click", (evt) => {
    // stop bubbling
    evt.stopPropagation();

    if (btn.classList.contains('active')) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove('active');
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add('active');
    }

    fetchFavMeals();
  });

  meal.addEventListener('click', () => {
    showMealInfo(mealData);
  })

  mealsEl.appendChild(meal);

}

function addMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  // clean the container
  favoriteContainer.innerHTML = "";

  const mealIds = getMealsLS();
  // console.log(mealIds.length);

  // const meals = [];
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    // console.log(mealId);
    const meal = await getMealById(mealId);
    // add them to the screen
    addMealFav(meal);
    // meals.push(meal);
  }
  // console.log(meals); 
}

function addMealFav(mealData) {  
  const favMeal = document.createElement('li');

  favMeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>
  `;

  const btn = favMeal.querySelector('.clear');

  btn.addEventListener('click', (evt) => {
    // stop bubbling
    evt.stopPropagation();

    removeMealLS(mealData.idMeal);
    // refetch again
    fetchFavMeals();
  });

  
  favMeal.addEventListener('click', () => {
    showMealInfo(mealData);
  });

  favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
  // clean it up
  mealInfoEl.innerHTML = "";

  // update the Meal info
  const mealEl = document.createElement("div");

  const ingredients = [];
  
  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (mealData['strIngredient' + i]) {
      ingredients.push(
        `${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`
      );
    } else {
      break;
    }
    
  }
  mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <p>${mealData.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>${ingredients.map((ing) => `
      <li>${ing}</li>
      `).join("")}
    </ul>
  `;

  mealInfoEl.appendChild(mealEl);

  // show the popup
  mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener('click', () => {
 getMealsByBtnKey();
});

// Key down search
searchTerm.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    getMealsByBtnKey();
  }
})

// create function for seaech
async function getMealsByBtnKey() {
  // clean container
  mealsEl.innerHTML = "";

  const search = searchTerm.value;
  const meals = await getMealsBySearch(search);
  // console.log(meals);

  if (meals) {
    meals.forEach((meal) =>{
      addMeal(meal);
    });
  } else {
    mealsEl.innerHTML = `
      <div class="search-not-match">
        Search can't match
      </div>
    `;
  }
}

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
