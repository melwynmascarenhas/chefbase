import { getDBConnection } from "../db/db.js";

// GET /api/favorites
export async function getFavorites(req, res) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });

    const db = await getDBConnection();
    let isFavorite = true;

    const favorites = await db.all(
      "SELECT recipe_id, recipe_name, recipe_image, recipe_category, recipe_area FROM favorites WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );

    console.log(favorites);

    const enriched = favorites.map((r) => ({
      id: r.recipe_id,
      title: r.recipe_name,
      category: r.recipe_category,
      area: r.recipe_area,
      image: r.recipe_image,
      isFavorite,
      raw: r,
    }));

    await db.close();
    res.json(enriched);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST /api/favorites
// body: { recipe_id, recipe_name, recipe_image, recipe_category, recipe_area }
export async function addFavorite(req, res) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });

    const {
      recipe_id,
      recipe_name = null,
      recipe_image = null,
      recipe_category = null,
      recipe_area = null,
    } = req.body;

    if (!recipe_id) return res.status(400).json({ error: "Missing recipe_id" });

    const db = await getDBConnection();

    // Optionally: ensure recipe_id is present in recipes cache (if you use recipes table)
    // (uncomment if you maintain a recipes table and prefer joining)
    // const cached = await db.get("SELECT id FROM recipes WHERE id = ?", [recipe_id]);
    // if (!cached && recipe_name) {
    //   // Could insert into recipes here to cache minimal info
    // }

    await db.run(
      `INSERT OR IGNORE INTO favorites (user_id, recipe_id, recipe_name, recipe_image, recipe_category, recipe_area)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        recipe_id,
        recipe_name,
        recipe_image,
        recipe_category,
        recipe_area,
      ]
    );

    await db.close();
    res.json({ success: true });
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// DELETE /api/favorites/:id   (id = recipe_id)
export async function removeFavorite(req, res) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });

    const recipeId = req.params.id;
    if (!recipeId) return res.status(400).json({ error: "Missing recipe id" });

    const db = await getDBConnection();
    await db.run("DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?", [
      userId,
      recipeId,
    ]);
    await db.close();

    res.json({ success: true });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/favorites/search?q=term
// This performs a TheMealDB search and enriches results with isFavorite
export async function searchRecipes(req, res) {
  try {
    console.log(req.query);
    const query = req.query.q || "";
    const userId = req.session.userId || null;

    const apiRes = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        query
      )}`
    );
    const data = await apiRes.json();
    const recipes = data.meals || [];

    const db = await getDBConnection();
    let favIds = [];
    if (userId) {
      const favs = await db.all(
        "SELECT recipe_id FROM favorites WHERE user_id = ?",
        [userId]
      );
      favIds = favs.map((f) => String(f.recipe_id));
    }

    const enriched = recipes.map((r) => ({
      id: r.idMeal,
      title: r.strMeal,
      category: r.strCategory,
      area: r.strArea,
      image: r.strMealThumb,
      isFavorite: favIds.includes(String(r.idMeal)),
      raw: r,
    }));

    await db.close();
    res.json(enriched);
  } catch (err) {
    console.error("Error searching recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/favorites/home  (optional: returns home recipes with isFavorite flag)
export async function getHomeRecipes(req, res) {
  try {
    const userId = req.session.userId || null;

    // Example: fetch default "a" search (you can swap to random letters)
    const apiRes = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=a"
    );
    const data = await apiRes.json();
    const recipes = data.meals || [];

    const db = await getDBConnection();
    let favIds = [];
    if (userId) {
      const favs = await db.all(
        "SELECT recipe_id FROM favorites WHERE user_id = ?",
        [userId]
      );
      favIds = favs.map((f) => String(f.recipe_id));
    }

    const enriched = recipes.map((r) => ({
      id: r.idMeal,
      title: r.strMeal,
      category: r.strCategory,
      area: r.strArea,
      image: r.strMealThumb,
      isFavorite: favIds.includes(String(r.idMeal)),
      raw: r,
    }));

    await db.close();
    res.json(enriched);
  } catch (err) {
    console.error("Error fetching home recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getRecipeById(req, res) {
  try {
    const id = req.params.id;

    // FIXED: Correct way to get the logged-in user's ID
    const userId = req.session.userId || null;

    // 1. Fetch recipe from external API
    const apiRes = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await apiRes.json();

    const meal = data.meals && data.meals[0];
    const ingredients = [];

    if (!meal) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    //building the ingredients array
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const mea = meal[`strMeasure${i}`];

      if (ing && ing.trim()) {
        ingredients.push({
          ingredient: ing,
          measure: mea || "",
        });
      }
    }

    // 2. Check if recipe is in favorites
    const db = await getDBConnection();
    let isFavorite = false;

    if (userId) {
      const fav = await db.get(
        "SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?",
        [userId, id]
      );

      if (fav) {
        isFavorite = true;
      }
    }

    await db.close();

    // 3. Send final response
    res.json({
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      image: meal.strMealThumb,
      youtube: meal.strYoutube,
      ingredients: ingredients,
      isFavorite: isFavorite,
    });
  } catch (err) {
    console.error("Error in getRecipeById:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
