import express from "express";
import { generateDKIMKeys } from "../controllers/dkimController.js";

const router = express.Router();

// POST /api/dkim/generate
router.post("/generate", generateDKIMKeys);

export default router;
