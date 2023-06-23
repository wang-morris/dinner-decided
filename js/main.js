var $ingredientsTextArea = document.querySelector('.ingredients-textarea');
var $aboutContainer = document.querySelector('.about-container');
var $imagePlaceholder = document.querySelector('.recipe-img');
var $mealName = document.querySelector('.meal-name');

var ingredientsButton = document.querySelector('.recipe-container .recipe-button:nth-child(1)');
var aboutButton = document.querySelector('.recipe-container .recipe-button:nth-child(2)');

function updateTextArea(display, ingredientsText, aboutText, calories, nutrients) {
  calories = calories || 0;
  nutrients.Protein = nutrients.Protein || 0;
  nutrients.Fat = nutrients.Fat || 0;
  nutrients.Carbohydrates = nutrients.Carbohydrates || 0;

  if (display === 'about') {
    $ingredientsTextArea.style.display = 'none';
    $aboutContainer.style.display = 'block';
    $aboutContainer.setAttribute('data-calories', calories.toFixed(0));
    $aboutContainer.setAttribute('data-protein', nutrients.Protein.toFixed(1));
    $aboutContainer.setAttribute('data-fat', nutrients.Fat.toFixed(1));
    $aboutContainer.setAttribute('data-carbohydrates', nutrients.Carbohydrates.toFixed(1));
    $aboutContainer.innerHTML = `
      <span>For full recipe directions, please <a href="${aboutText}" target="_blank">click here</a></span><br>
      <br>
      <div class='nutrients-container'>
        <strong class='calories'>Calories:</strong> ${calories.toFixed(0)}<br>
        ${Object.keys(nutrients).map(nutrient => `<span class="nutrients">${nutrient}:</span> ${nutrients[nutrient].toFixed(1)}g`).join('<br>')}
      </div
    `;
  } else {
    $ingredientsTextArea.style.display = 'block';
    $aboutContainer.style.display = 'none';
    $ingredientsTextArea.value = ingredientsText;
  }
}

var currentRecipe = null;

// fetching data for featured recipe
function getRecipeData(query, display) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=cfff0803&app_key=e81eff927b70d1b43add769f0adfa4e5`
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var result = xhr.response.hits;
    var firstResult = result[0];
    var mealName = firstResult.recipe.label;
    var imageURL = firstResult.recipe.image;
    var recipe = xhr.response.hits[0].recipe;
    var ingredients = recipe.ingredientLines;
    var ingredientsText = ingredients.join('\n');
    var about = xhr.response.hits[0].recipe.url;
    var aboutText = about;
    var calories = recipe.calories;
    var nutrients = {
      Protein: recipe.totalNutrients.PROCNT.quantity,
      Fat: recipe.totalNutrients.FAT.quantity,
      Carbohydrates: recipe.totalNutrients.CHOCDF.quantity
    };

    currentRecipe = {
      mealName,
      recipeImg: imageURL,
      ingredients: ingredientsText,
      aboutText,
      aboutHref: aboutText,
      calories,
      nutrients
    };

    updateTextArea(display, ingredientsText, aboutText, calories, nutrients);

    $mealName.textContent = mealName;
    $imagePlaceholder.src = imageURL;
  });
  xhr.send();
}

// adding to featured recipe to favorites
var addToFavorites = document.querySelector('.add-favorite');

window.addEventListener('load', event => {
  getRecipeData('chicken', 'ingredients');
});

function updateActiveButton(button1, button2) {
  button1.classList.add('active');
  button2.classList.remove('active');
}

ingredientsButton.addEventListener('click', function () {
  updateActiveButton(ingredientsButton, aboutButton);
  getRecipeData('chicken', 'ingredients');
});

aboutButton.addEventListener('click', function () {
  updateActiveButton(aboutButton, ingredientsButton);
  getRecipeData('chicken', 'about');
});

var favoritesLinks = document.getElementsByClassName('favorite-link');
var homePage = document.querySelector('.home-page');
var favoritesPage = document.createElement('div');
favoritesPage.className = 'favorites-page';
favoritesPage.style.display = 'none';
var banner = document.querySelector('.green-heading');
banner.appendChild(favoritesPage);
var pageTitle = document.createElement('h1');
pageTitle.textContent = 'Favorites';
favoritesPage.appendChild(pageTitle);
var favoriteItemsContainer = document.createElement('div');
favoriteItemsContainer.className = 'favorite-items-container';
favoritesPage.appendChild(favoriteItemsContainer);
var noFavoritesMessage = document.createElement('p');
noFavoritesMessage.textContent = 'No favorites added yet!';
noFavoritesMessage.className = 'no-favorites-message';
noFavoritesMessage.id = 'no-favorites';
favoriteItemsContainer.appendChild(noFavoritesMessage);

for (var i = 0; i < favoritesLinks.length; i++) {
  favoritesLinks[i].addEventListener('click', function (event) {
    event.preventDefault();
    homePage.style.display = 'none';
    favoritesPage.style.display = 'block';
    searchPage.style.display = 'none';
    favoritesPage.scrollTop = 0;
  });
}

function updateNoFavoritesMessage() {
  var favoriteItems = favoriteItemsContainer.querySelectorAll('.row');
  if (favoriteItems.length === 0) {
    noFavoritesMessage.style.display = 'block';
  } else {
    noFavoritesMessage.style.display = 'none';
  }
}

// creating and appending elements to the favorites page
function appendFavoriteItem(favoriteItem) {
  var favoriteItemsContainer = document.querySelector('.favorite-items-container');

  var favoriteRow = document.createElement('div');
  favoriteRow.className = 'row';

  var mealColumnSection = document.createElement('div');
  mealColumnSection.className = 'column-half meal-column-section img-container';

  var mealName = document.createElement('h4');
  mealName.className = 'meal-name';
  mealName.textContent = favoriteItem.mealName;

  var recipeImg = document.createElement('img');
  recipeImg.className = 'recipe-img';

  recipeImg.src = favoriteItem.recipeImg;

  var recipeColumnSection = document.createElement('div');
  recipeColumnSection.className = 'column-half meal-column-section';

  var recipeContainer = document.createElement('div');
  recipeContainer.className = 'recipe-container';

  var ingredientsTextarea = document.createElement('textarea');
  ingredientsTextarea.className = 'ingredients-textarea';
  ingredientsTextarea.readOnly = true;
  ingredientsTextarea.value = favoriteItem.ingredients;

  var toggler = document.createElement('div');
  toggler.className = 'toggler';

  var ingredientsButton = document.createElement('button');
  ingredientsButton.className = 'recipe-button active';
  ingredientsButton.textContent = 'Ingredients';

  var aboutButton = document.createElement('button');
  aboutButton.className = 'recipe-button';
  aboutButton.textContent = 'About';

  var aboutContainer = document.createElement('div');
  aboutContainer.className = 'about-container';
  aboutContainer.style.display = 'none';
  aboutContainer.innerHTML = `
  <span>For full recipe directions, please <a href="${favoriteItem.aboutHref}" target="_blank">click here</a></span><br>
  <br>
  <div class='nutrients-container'>
    <strong class='calories'>Calories:</strong> ${Math.round(favoriteItem.calories)}<br>
    ${Object.keys(favoriteItem.nutrients).map(nutrient => `<span class="nutrients">${nutrient}:</span> ${parseFloat(favoriteItem.nutrients[nutrient]).toFixed(1)}g`).join('<br>')}
  </div>
`;

  var aboutLink = document.createElement('a');
  aboutLink.className = 'about-link';
  aboutLink.textContent = favoriteItem.aboutText;
  aboutLink.href = favoriteItem.aboutHref;
  aboutLink.target = '_blank';

  var ingredientsInfo = document.createElement('p');
  ingredientsInfo.className = 'ingredients';
  ingredientsInfo.textContent = favoriteItem.ingredientsText;

  var caloriesElement = document.createElement('p');
  caloriesElement.className = 'calories';
  caloriesElement.textContent = `Calories: ${Math.round(favoriteItem.calories)}`;

  var nutrientsElement = document.createElement('ul');
  nutrientsElement.className = 'nutrients';
  for (const nutrient in favoriteItem.nutrients) {
    var listItem = document.createElement('li');
    listItem.textContent = `${nutrient}: ${Math.round(favoriteItem.nutrients[nutrient])}g`;
    nutrientsElement.appendChild(listItem);
  }

  toggler.appendChild(ingredientsButton);
  toggler.appendChild(aboutButton);

  recipeContainer.appendChild(toggler);
  recipeContainer.appendChild(ingredientsTextarea);
  recipeContainer.appendChild(aboutContainer);

  mealColumnSection.appendChild(recipeImg);
  mealColumnSection.appendChild(mealName);
  recipeColumnSection.appendChild(recipeContainer);

  favoriteRow.appendChild(mealColumnSection);
  favoriteRow.appendChild(recipeColumnSection);

  favoriteItemsContainer.appendChild(favoriteRow);
  updateNoFavoritesMessage();
  document.getElementById('no-favorites').style.display = 'none';

  function updateFavoriteActiveButton(button1, button2) {
    button1.classList.add('active');
    button2.classList.remove('active');
  }

  ingredientsButton.addEventListener('click', function () {
    updateFavoriteActiveButton(ingredientsButton, aboutButton);

    ingredientsTextarea.style.display = 'block';
    aboutContainer.style.display = 'none';
  });

  aboutButton.addEventListener('click', function () {
    updateFavoriteActiveButton(aboutButton, ingredientsButton);
    ingredientsTextarea.style.display = 'none';
    aboutContainer.style.display = 'block';
  });
}

// local storage
function saveFavorites(favoriteItems) {
  localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems.reverse()));
}

function getFavorites() {
  const favoriteItemsJSON = localStorage.getItem('favoriteItems') || '[]';
  return JSON.parse(favoriteItemsJSON).reverse();
}

addToFavorites.addEventListener('click', function () {
  favoriteItemsContainer.scrollTop = 0;
  if (!currentRecipe) return;

  const favoriteItems = getFavorites();
  favoriteItems.unshift(currentRecipe);
  saveFavorites(favoriteItems);

  appendFavoriteItem(currentRecipe);
  updateNoFavoritesMessage();
});

const favoriteItems = getFavorites();
favoriteItems.forEach(appendFavoriteItem);

// search page rendering
var searchPage = document.createElement('div');
searchPage.className = 'search-page';
searchPage.style.display = 'none';

var searchBanner = document.querySelector('.green-heading');
searchBanner.appendChild(searchPage);

var searchContainer = document.createElement('div');
searchContainer.className = 'search-container';

var searchInput = document.createElement('input');
searchInput.className = 'search-header-items';
searchInput.id = 'search';
searchInput.type = 'text';
searchInput.placeholder = 'search by desired ingredients!';
searchInput.style.display = 'block';

var mobileSearchButton = document.createElement('button');
mobileSearchButton.className = 'header-items search-feature-button';
mobileSearchButton.textContent = 'Search';
mobileSearchButton.style.display = 'block';

searchContainer.appendChild(searchInput);
searchContainer.appendChild(mobileSearchButton);
searchPage.appendChild(searchContainer);

var searchResultsContainer = document.createElement('div');
searchResultsContainer.className = 'search-results-container';
searchPage.appendChild(searchResultsContainer);

var searchButton = document.querySelector('.search-icon');
searchButton.addEventListener('click', function (event) {
  loadingSymbol.style.display = 'none';
  searchPage.scrollTop = 0;
  event.preventDefault();
  homePage.style.display = 'none';
  favoritesPage.style.display = 'none';
  searchPage.style.display = 'block';
  searchResultsContainer.classList.add('no-results');
  setTimeout(function () {
    window.scrollTo(0, favoritesPage.offsetTop);
  }, 100);
});

// search function starts here
function appendSearchItem(searchItem, parentContainer) {
  var searchRow = document.createElement('div');
  searchRow.className = 'row search-favorite';

  var mealColumnSection = document.createElement('div');
  mealColumnSection.className = 'column-half meal-column-section img-container';

  var mealName = document.createElement('h4');
  mealName.className = 'meal-name';
  mealName.textContent = searchItem.mealName;

  var recipeImg = document.createElement('img');
  recipeImg.className = 'recipe-img';
  recipeImg.src = searchItem.recipeImg;

  var recipeColumnSection = document.createElement('div');
  recipeColumnSection.className = 'column-half meal-column-section';

  var recipeContainer = document.createElement('div');
  recipeContainer.className = 'recipe-container';

  var ingredientsTextarea = document.createElement('textarea');
  ingredientsTextarea.className = 'ingredients-textarea';
  ingredientsTextarea.readOnly = true;
  ingredientsTextarea.value = searchItem.ingredients;

  var aboutContainer = document.createElement('div');
  aboutContainer.className = 'about-container';
  aboutContainer.style.display = 'none';
  aboutContainer.innerHTML = `
  <span>For full recipe directions, please <a href="${searchItem.aboutHref}" target="_blank">click here</a></span><br>
  <br>
  <div class='nutrients-container'>
    <strong class='calories'>Calories:</strong> ${Math.round(searchItem.calories)}<br>
    ${Object.keys(searchItem.nutrients).map(nutrient => `<span class="nutrients">${nutrient}:</span> ${parseFloat(searchItem.nutrients[nutrient]).toFixed(1)}g`).join('<br>')}
  </div>
`;

  var toggler = document.createElement('div');
  toggler.className = 'toggler';

  var ingredientsButton = document.createElement('button');
  ingredientsButton.className = 'recipe-button active';
  ingredientsButton.textContent = 'Ingredients';

  var aboutButton = document.createElement('button');
  aboutButton.className = 'recipe-button';
  aboutButton.textContent = 'About';

  toggler.appendChild(ingredientsButton);
  toggler.appendChild(aboutButton);

  recipeContainer.appendChild(toggler);
  recipeContainer.appendChild(ingredientsTextarea);
  recipeContainer.appendChild(aboutContainer);

  mealColumnSection.appendChild(recipeImg);
  mealColumnSection.appendChild(mealName);
  recipeColumnSection.appendChild(recipeContainer);

  searchRow.appendChild(mealColumnSection);
  searchRow.appendChild(recipeColumnSection);

  var addToFavoritesButton = document.createElement('button');
  addToFavoritesButton.className = 'add-favorite';
  addToFavoritesButton.textContent = 'Add recipe to favorites';

  addToFavoritesButton.addEventListener('click', function () {
    var favoriteItemsJSON = localStorage.getItem('favoriteItems') || '[]';
    var favoriteItems = JSON.parse(favoriteItemsJSON);
    favoriteItems.push(searchItem);
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));

    appendFavoriteItem(searchItem);
    updateNoFavoritesMessage();
  });

  searchRow.appendChild(addToFavoritesButton);

  parentContainer.insertBefore(searchRow, parentContainer.firstChild);

  function updateSearchActiveButton(button1, button2) {
    button1.classList.add('active');
    button2.classList.remove('active');
  }

  ingredientsButton.addEventListener('click', function () {
    updateSearchActiveButton(ingredientsButton, aboutButton);
    ingredientsTextarea.style.display = 'block';
    aboutContainer.style.display = 'none';
  });

  aboutButton.addEventListener('click', function () {
    updateSearchActiveButton(aboutButton, ingredientsButton);
    ingredientsTextarea.style.display = 'none';
    aboutContainer.style.display = 'block';
  });
}

function searchRecipeData(query) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=cfff0803&app_key=e81eff927b70d1b43add769f0adfa4e5`
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var results = xhr.response.hits;

    if (results.length > 0) {
      searchResultsContainer.classList.remove('no-results');
    }

    for (let i = 0; i < results.length; i++) {
      var result = results[i].recipe;

      var mealName = result.label;
      var imageURL = result.image;
      var ingredients = result.ingredientLines;
      var ingredientsText = ingredients.join('\n');
      var about = result.url;
      var aboutText = about;
      var calories = result.calories;
      var nutrients = {
        Protein: result.totalNutrients.PROCNT.quantity,
        Fat: result.totalNutrients.FAT.quantity,
        Carbohydrates: result.totalNutrients.CHOCDF.quantity
      };

      var currentRecipe = {
        mealName,
        recipeImg: imageURL,
        ingredients: ingredientsText,
        aboutText,
        aboutHref: aboutText,
        calories,
        nutrients
      };

      appendSearchItem(currentRecipe, searchResultsContainer);
    }
  });
  xhr.send();
}

mobileSearchButton.addEventListener('click', function (event) {
  event.preventDefault();
  var ingredient = searchInput.value;

  if (ingredient === '') {
    alert('Please enter at least one ingredient');
    return;
  }
  searchRecipeData(ingredient);
  searchInput.value = '';
});

var mobileSearchInput = document.querySelector('.search-header-items');
mobileSearchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    performSearch();
  }
});

var headerSearchInput = document.getElementById('search');
headerSearchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    performSearch();
  }
});

var desktopSearchButton = document.querySelector('.search-button');
desktopSearchButton.addEventListener('click', function () {
  performSearch();
});

function performSearch() {
  loadingSymbol.style.display = 'block';
  checkConnection();

  var searchInput = document.getElementById('search');
  var mobileSearchInput = document.querySelector('.search-header-items');
  var searchTerm = searchInput.value.trim();
  var ingredient = searchInput.value;
  var mobileSearchTerm = mobileSearchInput.value.trim();
  var mobileIngredient = mobileSearchInput.value;

  if (ingredient === '' && mobileIngredient === '') {
    alert('Please enter at least one ingredient');
    return;
  }

  if (searchTerm !== '') {
    searchRecipeData(searchTerm, 'ingredients');
    searchInput.value = '';
    mobileSearchInput.value = '';
  }

  if (mobileSearchTerm !== '') {
    searchRecipeData(mobileSearchTerm, 'ingredients');
    mobileSearchInput.value = '';
  }
  searchPage.scrollTop = 0;
  event.preventDefault();
  homePage.style.display = 'none';
  favoritesPage.style.display = 'none';
  searchPage.style.display = 'block';
  searchResultsContainer.classList.add('no-results');
  setTimeout(function () {
    window.scrollTo(0, favoritesPage.offsetTop);
  }, 100);
}

var title = document.querySelector('h2');
title.addEventListener('click', function () {
  showHomePage();
});

function showHomePage() {
  homePage.style.display = 'block';
  favoritesPage.style.display = 'none';
  searchPage.style.display = 'none';
  searchResultsContainer.innerHTML = '';
  searchResultsContainer.classList.add('no-results');
  searchInput.value = '';
  searchPage.scrollTop = 0;
}

// connectivity and loading data indicators
var loadingContainer = document.createElement('div');
loadingContainer.className = 'loading-container';
searchPage.appendChild(loadingContainer);

var loadingSymbol = document.createElement('div');
loadingSymbol.className = 'loading';
loadingSymbol.innerHTML = `
  <div></div>
  <div></div>
  <div></div>
  <div></div>
`;

loadingContainer.appendChild(loadingSymbol);

var errorMessageContainer = null;

function checkConnection() {
  if (!navigator.onLine) {
    if (!errorMessageContainer) {
      loadingSymbol.style.display = 'none';
      errorMessageContainer = document.createElement('div');
      var errorMessage = document.createElement('div');
      errorMessage.className = 'connection-error';
      errorMessage.textContent = 'Sorry, there was an error connecting to the network! Please check your internet connection.';
      errorMessageContainer.appendChild(errorMessage);
      searchPage.appendChild(errorMessageContainer);
    }
  } else {
    if (errorMessageContainer) {
      searchPage.removeChild(errorMessageContainer);
      errorMessageContainer = null;
    }
  }
}
