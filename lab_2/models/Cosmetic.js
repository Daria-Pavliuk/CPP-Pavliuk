import mongoose from "mongoose";

const cosmeticSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0.01,
        },
    },
    { timestamps: true }
);

const Cosmetic = mongoose.model("Cosmetic", cosmeticSchema);

export default Cosmetic;
