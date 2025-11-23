import express from "express";
import { exportarExcelController } from "../controllers/reportController.js";

const router = express.Router();

router.post("/export/excel", exportarExcelController);

export default router;
