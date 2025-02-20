import type { Request, Response } from "express";
import { Recipe, Category, CategoryRecipe } from "../models/index";

interface AuthRequest extends Request {
  user?: any;
}

const createCategory = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "El campo 'name' es obligatorio" });
  }

  const existingCategory = await Category.findOne({
    name: name,
    owner: req.user._id,
  }).exec();
  if (existingCategory) {
    return res.status(409).json({ message: "The categiry already exist" });
  }

  try {
    const newCategory = await Category.create({ name, owner: req.user._id });
    return res
      .status(201)
      .json({ message: "Categoría creada", category: newCategory });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};

const updateCategory = async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (!name) {
    return res.status(400).json({ message: "El campo 'name' es obligatorio" });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    category.name = name;
    await category.save();
    return res.status(200).json({ message: "Categoría actualizada", category });
  } catch (error) {
    console.error("Error actualizando la categoría:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};

const deleteCategory = async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await Recipe.deleteMany({ categories: category.name });

    await Category.findByIdAndDelete(categoryId);

    return res
      .status(200)
      .json({ message: "Categoría eliminada junto con las recetas asociadas" });
  } catch (error) {
    console.error("Error eliminando la categoría:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Error obteniendo las categorías:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};

const getUserCategories = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.user);
    const categories = await Category.find({ owner: req.user._id }).populate(
      "owner",
      "username email"
    );
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Error obteniendo las categorías del usuario:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};

const assignCategoryToRecipe = async (req: AuthRequest, res: Response) => {
  const { recipeId } = req.params;
  const { categoryId } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }
  if (!categoryId) {
    return res
      .status(400)
      .json({ message: "El campo 'categoryId' es obligatorio" });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    const existingRelation = await CategoryRecipe.findOne({
      recipeId,
      categoryId,
    });
    if (existingRelation) {
      return res
        .status(400)
        .json({ message: "La categoría ya está asignada a la receta" });
    }
    const newRelation = await CategoryRecipe.create({ recipeId, categoryId });
    return res.status(201).json({
      message: "Categoría asignada a la receta",
      relation: newRelation,
    });
  } catch (error) {
    console.error("Error asignando la categoría:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  assignCategoryToRecipe,
  getUserCategories,
};
