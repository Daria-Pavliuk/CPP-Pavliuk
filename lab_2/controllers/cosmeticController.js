import mongoose from "mongoose";
import Cosmetic from "../models/Cosmetic.js";

function handleControllerError(res, error) {
    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: "Некоректний id товару" });
    }

    console.error(error);
    return res.status(500).json({ message: "Внутрішня помилка сервера" });
}

export async function getCosmetics(req, res) {
    try {
        const cosmetics = await Cosmetic.find().sort({ createdAt: -1 });
        return res.status(200).json(cosmetics);
    } catch (error) {
        return handleControllerError(res, error);
    }
}

export async function getCosmeticById(req, res) {
    try {
        const cosmetic = await Cosmetic.findById(req.params.id);

        if (!cosmetic) {
            return res.status(404).json({ message: "Товар не знайдено" });
        }

        return res.status(200).json(cosmetic);
    } catch (error) {
        return handleControllerError(res, error);
    }
}

export async function createCosmetic(req, res) {
    try {
        const { name, brand, description, price } = req.body;
        const cosmetic = await Cosmetic.create({ name, brand, description, price });

        return res.status(201).json(cosmetic);
    } catch (error) {
        return handleControllerError(res, error);
    }
}

export async function updateCosmetic(req, res) {
    try {
        const { name, brand, description, price } = req.body;

        const cosmetic = await Cosmetic.findByIdAndUpdate(
            req.params.id,
            { name, brand, description, price },
            { new: true, runValidators: true }
        );

        if (!cosmetic) {
            return res.status(404).json({ message: "Товар не знайдено" });
        }

        return res.status(200).json(cosmetic);
    } catch (error) {
        return handleControllerError(res, error);
    }
}

export async function deleteCosmetic(req, res) {
    try {
        const cosmetic = await Cosmetic.findByIdAndDelete(req.params.id);

        if (!cosmetic) {
            return res.status(404).json({ message: "Товар не знайдено" });
        }

        return res.status(200).json({ message: "Товар успішно видалено" });
    } catch (error) {
        return handleControllerError(res, error);
    }
}
