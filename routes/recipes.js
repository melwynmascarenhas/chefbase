import {
  getFavorites,
  addFavorite,
  removeFavorite,
  searchRecipes,
  getHomeRecipes,
  getRecipeById,
} from "../controllers/recipesController.js";
import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";

export const recipesRouter = express.Router();

// Favorites CRUD
recipesRouter.get("/favorites", requireAuth, getFavorites);
recipesRouter.post("/favorites", requireAuth, addFavorite);
recipesRouter.delete("/favorites/:id", requireAuth, removeFavorite);

// Recipe endpoints (server-side fetch)
recipesRouter.get("/search", searchRecipes);
recipesRouter.get("/home", getHomeRecipes);
recipesRouter.get("/recipe/:id", getRecipeById);
