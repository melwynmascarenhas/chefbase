export async function fetchHomeRecipes() {
  try {
    const res = await fetch("/api/recipes/home");
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error("Error fetching home recipes:", err);
    return [];
  }
}

export async function fetchRecipes(query = "") {
  try {
    const res = await fetch(`/api/recipes/search?q=${query}`);
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return [];
  }
}

export async function getRecipeById(id) {
  try {
    const res = await fetch(`/api/recipes/recipe/${id}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Recipe not found");

    return await res.json();
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return null;
  }
}
