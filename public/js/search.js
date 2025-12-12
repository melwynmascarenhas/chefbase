import { checkSession } from "./authUI.js";
import { logout } from "./logout.js";
import { showLoader, hideLoader, renderRecipes } from "./recipeUI.js";
import { fetchRecipes } from "./recipeService.js";

document.addEventListener("DOMContentLoaded", async () => {
  showLoader();
  await checkSession();
  hideLoader();

  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const resultsContainer = document.getElementById("recipe-cards");

  searchInput.focus();

  async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      resultsContainer.innerHTML = `<p class="loading-state">Type something to search 🍲</p>`;
      return;
    }

    resultsContainer.innerHTML = `<p class="loading-state">Searching recipes...</p>`;

    const recipes = await fetchRecipes(query);
    renderRecipes(recipes);
  }

  // Search on button click
  searchBtn.addEventListener("click", handleSearch);

  // Search on Enter key
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
});

// Fix old-state when navigating back
window.addEventListener("pageshow", async (event) => {
  if (event.persisted) {
    const searchInput = document.getElementById("search-input");

    // Only refresh if there was a previous query
    if (searchInput.value.trim()) {
      const resultsContainer = document.getElementById("recipe-cards");

      resultsContainer.innerHTML = `<p class="loading-state">Refreshing results...</p>`;

      const recipes = await fetchRecipes(searchInput.value.trim());
      renderRecipes(recipes);
    }
  }
});
