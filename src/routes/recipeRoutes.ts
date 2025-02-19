import { Router } from "express";
import {
    createRecipe,
    getRecipes,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    getUserRecipes
} from "../controllers/recipeControllers";
import authenticate from "../middlewares/auth";

const router = Router();
router.route("/").get(authenticate, getRecipes).post(authenticate, createRecipe)
router.get("/user", authenticate, getUserRecipes);
router.route("/:recipeId")
    .get(getRecipe)
    .put(authenticate, updateRecipe)
    .delete(authenticate, deleteRecipe);

export default router;
