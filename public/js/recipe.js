import { getRecipeById } from "./recipeService.js";
import { showLoader, hideLoader } from "./recipeUI.js";
import { logout } from "./logout.js";
import { checkSession } from "./authUI.js";
import { addFavorite, removeFavorite } from "./favoritesService.js";

async function loadRecipe() {
  showLoader();

  document.getElementById("logout-btn").addEventListener("click", logout);

  const session = await checkSession();

  if (session.isLoggedIn === false) {
    document.querySelector(".favorite-actions").style.display = "none";
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<p>Recipe not found.</p>";
    return;
  }

  try {
    let recipe = await getRecipeById(id);

    console.log(recipe.instructions);

    const addBtn = document.getElementById("add-fav-btn");
    const removeBtn = document.getElementById("remove-fav-btn");

    function updateFavoriteButtons(isFav) {
      if (isFav) {
        console.log(isFav);
        addBtn.style.display = "none";
        removeBtn.style.display = "inline-block";
      } else {
        console.log(isFav);
        addBtn.style.display = "inline-block";
        removeBtn.style.display = "none";
      }
    }

    //text Formatting function for instructions
    function formatInstructions(text) {
      const lines = text.split(/\r?\n/).filter((l) => l.trim());

      const steps = [];
      let current = null;

      lines.forEach((line) => {
        if (/^step\s*\d+/i.test(line)) {
          // Start a new step
          if (current) steps.push(current);
          current = { title: line.trim(), content: [] };
        } else {
          // Add content under the current step
          if (!current) {
            current = { title: "", content: [] };
          }
          current.content.push(line.trim());
        }
      });

      if (current) steps.push(current);

      return steps;
    }

    // set initial state
    updateFavoriteButtons(recipe.isFavorite);

    // ADD
    addBtn.addEventListener("click", async () => {
      await addFavorite(recipe);
      recipe = await getRecipeById(id); // refresh data
      updateFavoriteButtons(recipe.isFavorite);
    });

    // REMOVE
    removeBtn.addEventListener("click", async () => {
      await removeFavorite(recipe.id);
      recipe = await getRecipeById(id); // refresh data
      updateFavoriteButtons(recipe.isFavorite);
    });

    document.getElementById("recipe-title").textContent = recipe.title;
    document.getElementById(
      "recipe-category"
    ).textContent = `Category: ${recipe.category}`;
    document.getElementById("recipe-area").textContent = `Area: ${recipe.area}`;
    document.getElementById("recipe-thumb").src = recipe.image;

    // Ingredients + measures
    const ul = document.getElementById("recipe-ingredients");
    recipe.ingredients.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.measure} ${item.ingredient}`;
      ul.appendChild(li);
    });

    // Rendering Instructions
    const instructionsEl = document.getElementById("recipe-instructions");
    const steps = formatInstructions(recipe.instructions);
    instructionsEl.innerHTML = steps
      .map(
        (s) => `
      <div class="instruction-step">
        <h4>${s.title}</h4>
        <p>${s.content.join(" ")}</p>
      </div>
    `
      )
      .join("");

    // YouTube video
    if (recipe.youtube) {
      const videoId = recipe.youtube.split("v=")[1];
      document.getElementById(
        "recipe-video"
      ).src = `https://www.youtube.com/embed/${videoId}`;
    } else {
      document.getElementById("video-section").style.display = "none";
    }
  } catch (error) {
    console.error(error);
    document.body.innerHTML = "<p>Something went wrong loading the recipe.</p>";
  }

  hideLoader();
}

loadRecipe();
