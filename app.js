async function loadRecipes() {
  const res = await fetch("data/recipes.json");
  return res.json();
}

function findRecipes(userIngredients, recipes) {
  const userSet = new Set(
    userIngredients.map(i => i.trim().toLowerCase()).filter(Boolean)
  );
  return recipes.filter(r =>
    r.ingredients.every(i => userSet.has(i.toLowerCase()))
  );
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

async function performSearch() {
  const input = document.getElementById("ingredients-input").value;
  const userIngredients = input.split(",");
  const recipes = await loadRecipes();
  const matches = findRecipes(userIngrediens, recipes);
  renderRecipes(matches);
}

document.getElementById("search-btn").addEventListener("click", performSearch);

document.getElementById("ingredients-input").addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    await performSearch();
  }
});
