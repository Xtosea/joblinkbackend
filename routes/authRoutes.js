import express from "express";
import { adminLogin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.post("/register", register);
router.post("/login", login);

export default router;