import { Router } from "express";
import {
    getCosmetics,
    getCosmeticById,
    createCosmetic,
    updateCosmetic,
    deleteCosmetic,
} from "../controllers/cosmeticController.js";
import { validateCosmetic } from "../middleware/validateCosmetic.js";

const router = Router();

router.get("/", getCosmetics);
router.get("/:id", getCosmeticById);
router.post("/", validateCosmetic, createCosmetic);
router.put("/:id", validateCosmetic, updateCosmetic);
router.delete("/:id", deleteCosmetic);

export default router;