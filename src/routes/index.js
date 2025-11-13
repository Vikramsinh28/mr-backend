import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import expenseRoutes from "./expenseRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import doctorProdctRoutes from "./doctorProdctRoutes.js";
import visitRoutes from "./visitRoutes.js";

const router = express.Router();

// Mount all route modules
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/expenses", expenseRoutes);
router.use("/doctors", doctorRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/doctor-products", doctorProdctRoutes);
router.use("/visits", visitRoutes);

export default router;
