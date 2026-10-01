import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./services/db.js";
import cosmeticRoutes from "./routes/cosmeticRoutes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Сервер магазину косметики працює!");
});

app.use("/api/cosmetics", cosmeticRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Маршрут не знайдено" });
});

async function startServer() {
    if (!process.env.MONGO_URI) {
        throw new Error("Змінна середовища MONGO_URI не задана");
    }

    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
        console.log(`Сервер запущено на порті ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Не вдалося запустити сервер:", error.message);
    process.exit(1);
});
