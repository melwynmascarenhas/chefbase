import { checkSession } from "./authUI.js";

export async function getFavorites() {
  await checkSession();
  try {
    const res = await fetch("/api/recipes/favorites");
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      return (window.location.href = "/login.html");
    }
    return data || [];
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return [];
  }
}

export async function addFavorite(recipe) {
  await checkSession();
  await fetch("/api/recipes/favorites", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipe_id: recipe.id,
      recipe_name: recipe.title,
      recipe_image: recipe.image,
      recipe_category: recipe.category,
      recipe_area: recipe.area,
    }),
  });
}

export async function removeFavorite(mealId) {
  await checkSession();
  await fetch(`/api/recipes/favorites/${mealId}`, {
    method: "DELETE",
  });
}
