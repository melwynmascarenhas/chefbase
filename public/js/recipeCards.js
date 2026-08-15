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
export function renderRecipes(recipes, isLoggedIn = false) {
  const container = document.getElementById("recipe-cards");
  if (!container) return;

  if (!recipes || recipes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="cooking-pot" style="width: 48px; height: 48px; color: var(--text-secondary);"></i>
        <p>No recipes found</p>
      </div>
    `;
    if (window.lucide) {
      window.lucide.createIcons();
    }
    return;
  }

  container.innerHTML = recipes
    .map(
      (r) => `
    <div class="card glass" data-meal="${r.id}">
      <div class="image-wrapper">
        <img src="${r.image}" alt="${r.title}" />
        ${
          isLoggedIn
            ? `<span class="fav-icon">${
                r.isFavorite
                  ? `<i data-lucide="heart" class="heart-icon filled"></i>`
                  : `<i data-lucide="heart" class="heart-icon"></i>`
              }</span>`
            : ``
        }
      </div>

      <h3>${r.title}</h3>
      <p>${r.area || "Somewhere Delicious"} • ${r.category || "Special"}</p>
    </div>
  `
    )
    .join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const mealId = card.dataset.meal;
      window.location.href = `/recipe.html?id=${mealId}`;
    });
  });
}
