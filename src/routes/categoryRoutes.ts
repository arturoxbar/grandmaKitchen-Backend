import { Router } from "express";
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getUserCategories
} from "../controllers/categoryControllers";
import authenticate from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, createCategory);
router.put("/:categoryId", authenticate, updateCategory);
router.delete("/:categoryId", authenticate, deleteCategory);
router.get("/", getCategories);
router.get("/user", authenticate, getUserCategories)

export default router;
