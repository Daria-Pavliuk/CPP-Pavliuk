
// main.js
// Головний процес Electron для GlowBeauty.

import {
    app,
    BrowserWindow,
    ipcMain
} from "electron";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
    ProductsService
} from "@glowbeauty/core";

import {
    FileStorageAdapter
} from "./fileStorageAdapter.js";

import {
    createHandlers
} from "./ipcHandlers.js";

// Отримання шляху до поточної папки
const currentDir = dirname(
    fileURLToPath(import.meta.url)
);

// Створення вікна GlowBeauty
function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 750,
        minWidth: 650,
        minHeight: 550,
        title: "GlowBeauty Desktop",
        backgroundColor: "#fff8fa",

        webPreferences: {
            preload: join(currentDir, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    win.loadFile(
        join(currentDir, "renderer", "index.html")
    );
}

// Ініціалізація після готовності Electron
app.whenReady().then(() => {
    // Окремий файл даних десктопного клієнта
    const filePath = join(
        app.getPath("userData"),
        "products.json"
    );

    const adapter = new FileStorageAdapter(filePath);

    const service = new ProductsService(adapter);

    const handlers = createHandlers(service);

    // Реєстрація IPC-каналів
    ipcMain.handle(
        "products:list",
        (_event, query) => handlers.list(query)
    );

    ipcMain.handle(
        "products:add",
        (_event, text) => handlers.add(text)
    );

    ipcMain.handle(
        "products:remove",
        (_event, id) => handlers.remove(id)
    );

    createWindow();

    // Повторне відкриття вікна на macOS
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Завершення роботи на Windows і Linux
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
