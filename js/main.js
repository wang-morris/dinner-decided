var $ingredientsTextArea = document.querySelector('.ingredients-textarea');
var $aboutContainer = document.querySelector('.about-container');
var $imagePlaceholder = document.querySelector('.recipe-img');
var $mealName = document.querySelector('.meal-name');

var ingredientsButton = document.querySelector('.recipe-container .recipe-button:nth-child(1)');
var aboutButton = document.querySelector('.recipe-container .recipe-button:nth-child(2)');

function updateTextArea(display, ingredientsText, aboutText, calories, nutrients) {
  if (display === 'about') {
    $ingredientsTextArea.style.display = 'none';
    $aboutContainer.style.display = 'block';
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

    updateTextArea(display, ingredientsText, aboutText, calories, nutrients);

    $mealName.textContent = mealName;
    $imagePlaceholder.src = imageURL;
  });
  xhr.send();
}

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
