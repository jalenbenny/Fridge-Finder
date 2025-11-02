async function loadRecipes() {
  const res = await fetch("data/recipes.json");
  return res.json();
}

function getAllIngredients(recipes) {
  const ingredients = new Set();
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      ingredients.add(ingredient.toLowerCase());
    });
  });
  return Array.from(ingredients).sort();
}

function createIngredientBoxes(ingredients) {
  const container = document.getElementById("ingredients-container");
  container.innerHTML = "";
  
  ingredients.forEach(ingredient => {
    const box = document.createElement("div");
    box.className = "ingredient-box";
    box.textContent = ingredient;
    box.addEventListener("click", () => {
      box.classList.toggle("selected");
    });
    container.appendChild(box);
  });
}

function getSelectedIngredients() {
  return Array.from(document.querySelectorAll(".ingredient-box.selected"))
    .map(box => box.textContent.toLowerCase());
}

// updated: allow optional "match any" mode
function findRecipes(userIngredients, recipes, matchAll = true) {
  if (userIngredients.length === 0) return [];
  
  return recipes.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
    if (matchAll) {
      return recipeIngredients.every(i => userIngredients.includes(i));
    } else {
      return recipeIngredients.some(i => userIngredients.includes(i));
    }
  });
}

function renderRecipes(recipes) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (recipes.length === 0) {
    resultsDiv.textContent = "No matches found.";
    return;
  }

  for (const r of recipes) {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${r.image}" alt="${r.name}">
      <h3>${r.name}</h3>
      <p><strong>Ingredients:</strong> ${r.ingredients.join(", ")}</p>
      <p>${r.instructions}</p>
    `;
    resultsDiv.appendChild(card);
  }
}

async function initializeApp() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.textContent = "Loading recipes...";
  
  const recipes = await loadRecipes();
  const allIngredients = getAllIngredients(recipes);
  createIngredientBoxes(allIngredients);
  
  resultsDiv.textContent = "";
}

async function performSearch() {
  const userIngredients = getSelectedIngredients();
  if (userIngredients.length === 0) {
    alert("Please select at least one ingredient!");
    return;
  }

  const recipes = await loadRecipes();
  const matches = findRecipes(userIngredients, recipes, false); // match any
  renderRecipes(matches);
}

document.getElementById("search-btn").addEventListener("click", performSearch);

window.addEventListener("load", initializeApp);
