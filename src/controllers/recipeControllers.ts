import type { Request, Response } from "express";
import {
    Recipe, Category, CategoryRecipe, User
} from "../models/index";

interface AuthRequest extends Request {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    user?: any;
}


const createRecipe = async (req: AuthRequest, res: Response) => {
    const { name, description, image, steps, ingridients } = req.body

    if (!req.user) {
        return res.status(401).json({ message: "No autorizado" });
    }
    if (!name || !description) {
        return res.status(400).json({ message: "el nombre y la descripcion son obligatorios" })
    }

    console.log(req.body)

    try {
        const newRecipe = await Recipe.create({
            owner: req.user._id,
            name,
            description,
            steps,
            ingridients,
            image: image ? image : ""
        });
        return res.status(200).json({ message: "Recipe created", note: newRecipe });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

const getRecipes = async (req: AuthRequest, res: Response) => {
    try {
        const recipes = await Recipe.find().populate("owner", "username email");
        return res.status(200).json({ recipes });
    } catch (error) {
        console.error("Error obteniendo las recetas:", error);
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
};

const getRecipe = async (req: AuthRequest, res: Response) => {
    const { recipeId } = req.params;
    try {
        const recipe = await Recipe.findById(recipeId).populate("owner", "username email");
        if (!recipe) {
            return res.status(404).json({ message: "Receta no encontrada" });
        }
        return res.status(200).json({ recipe });
    } catch (error) {
        console.error("Error obteniendo la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
};

const updateRecipe = async (req: AuthRequest, res: Response) => {
    const { recipeId } = req.params;
    const { name, description, image, steps, ingridients } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: "No autorizado" });
    }
    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Receta no encontrada" });
        }

        if (name) recipe.name = name;
        if (description) recipe.description = description;
        if (image !== undefined) recipe.image = image;
        if (steps) recipe.steps = steps;
        if (ingridients) recipe.ingridients = ingridients;
        await recipe.save();
        return res.status(200).json({ message: "Receta actualizada", recipe });
    } catch (error) {
        console.error("Error actualizando la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
};

const deleteRecipe = async (req: AuthRequest, res: Response) => {
    const { recipeId } = req.params;

    if (!req.user) {
        return res.status(401).json({ message: "No autorizado" });
    }

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Receta no encontrada" });
        }

        await Recipe.findByIdAndDelete(recipeId);
        return res.status(200).json({ message: "Receta eliminada" });
    } catch (error) {
        console.error("Error eliminando la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
};

const getUserRecipes = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autorizado" });
    }
    try {
        const recipes = await Recipe.find({ owner: req.user._id }).populate("owner", "username email");
        return res.status(200).json({ recipes });
    } catch (error) {
        console.error("Error obteniendo las recetas del usuario:", error);
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
};


export {
    createRecipe,
    getRecipes,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    getUserRecipes
}