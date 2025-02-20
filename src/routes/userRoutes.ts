import { Router } from "express";
import {
  singIn,
  login,
  EditUser,
  deleteUser,
  getUserInfo,
  resetPassword,
} from "../controllers/userControllers";
import authenticate from "../middlewares/auth";

const router = Router();

// Ruta para registrar un nuevo usuario (pública)
router.post("/signup", singIn);

// Ruta para iniciar sesión (pública)
router.post("/login", login);

// Rutas protegidas
router
  .route("/user")
  .put(authenticate, EditUser)
  .patch(resetPassword)
  .delete(authenticate, deleteUser)
  .get(authenticate, getUserInfo);

export default router;
