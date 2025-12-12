//Recipes Cards UI

export function showLoader() {
  document.getElementById("preloader")?.classList.remove("hidden");
}

export function hideLoader() {
  const loader = document.getElementById("preloader");
  if (!loader) return;
  loader.style.opacity = "0";
  setTimeout(() => loader.classList.add("hidden"), 400);
}

window.showLoader = showLoader;
window.hideLoader = hideLoader;

// Render recipe cards dynamically
export function renderRecipes(recipes) {
  const container = document.getElementById("recipe-cards");
  if (!container) return;

  if (!recipes || recipes.length === 0) {
    container.innerHTML = `<p class="empty-state">No recipes found 🍳</p>`;
    return;
  }

  container.innerHTML = recipes
    .map(
      (r) => `
    <div class="card glass" data-meal="${r.id}">
      <div class="image-wrapper">
        <img src="${r.image}" alt="${r.title}" />
        <span class="fav-icon">${r.isFavorite ? "❤️" : "🤍"}</span>
      </div>

      <h3>${r.title}</h3>
      <p>${r.area} • ${r.category}</p>
    </div>
  `
    )
    .join("");

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const mealId = card.dataset.meal;
      window.location.href = `/recipe.html?id=${mealId}`;
    });
  });
}
