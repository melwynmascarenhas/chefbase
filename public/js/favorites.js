import { checkSession } from "./authUI.js";
import { logout } from "./logout.js";
import { showLoader, hideLoader, renderRecipes } from "./recipeUI.js";
import { getFavorites } from "./favoritesService.js";

async function loadFavorites() {
  showLoader();
  await checkSession();

  const empty = document.getElementById("no-favorites");
  const favorites = await getFavorites();

  if (favorites.length > 0) {
    renderRecipes(favorites);
    empty.classList.add("hidden");
  } else {
    empty.classList.remove("hidden");
  }

  hideLoader();
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("logout-btn").addEventListener("click", logout);
  loadFavorites();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    loadFavorites(); // refresh list
  }
});
