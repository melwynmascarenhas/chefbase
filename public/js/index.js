import { checkSession } from "./authUI.js";
import { logout } from "./logout.js";
import { fetchHomeRecipes } from "./recipeService.js";
import { renderRecipes, showLoader, hideLoader } from "./recipeUI.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("logout-btn").addEventListener("click", logout);
  showLoader();
  await checkSession();
  const recipes = await fetchHomeRecipes();
  renderRecipes(recipes);
  hideLoader();
});

// Fix old state when navigating back
window.addEventListener("pageshow", async (event) => {
  if (event.persisted) {
    showLoader();
    await checkSession();
    const recipes = await fetchHomeRecipes();
    renderRecipes(recipes);
    hideLoader();
  }
});
