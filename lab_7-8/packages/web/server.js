
// server.js
// Локальний HTTP-сервер веб-клієнта GlowBeauty.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const WEB_DIR = dirname(fileURLToPath(import.meta.url));

const CORE_DIR = dirname(
    fileURLToPath(import.meta.resolve("@glowbeauty/core"))
);

const CORE_PREFIX = "/node_modules/@glowbeauty/core/";

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
};

// Дозволені файли веб-клієнта
const WEB_FILES = [
    "index.html",
    "style.css",
    "script.js",
    "localStorageAdapter.js"
];

// Дозволені модулі спільного ядра
const CORE_FILES = [
    "index.js",
    "productValidation.js",
    "productUtils.js",
    "storageAdapter.js",
    "productsService.js"
];

// Визначення шляху до дозволеного файлу
export function resolveFilePath(urlPath) {
    let pathname;

    try {
        pathname = decodeURIComponent(urlPath.split("?")[0]);
    } catch {
        return null;
    }

    if (pathname.startsWith(CORE_PREFIX)) {
        const fileName = pathname.slice(CORE_PREFIX.length);

        return CORE_FILES.includes(fileName)
            ? join(CORE_DIR, fileName)
            : null;
    }

    const fileName =
        pathname === "/" ? "index.html" : pathname.slice(1);

    return WEB_FILES.includes(fileName)
        ? join(WEB_DIR, fileName)
        : null;
}

// Створення HTTP-сервера
export function createAppServer() {
    return createServer(async (request, response) => {
        const filePath = resolveFilePath(request.url ?? "");

        if (!filePath || !["GET", "HEAD"].includes(request.method)) {
            response.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            response.end("Не знайдено");
            return;
        }

        try {
            const content = await readFile(filePath);

            response.writeHead(200, {
                "Content-Type": MIME_TYPES[extname(filePath)]
            });

            response.end(
                request.method === "HEAD" ? undefined : content
            );
        } catch {
            response.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            response.end("Не знайдено");
        }
    });
}

// Запуск сервера тільки при прямому виконанні файлу
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const port = Number(process.env.PORT) || 3000;

    createAppServer().listen(port, () => {
        console.log(
            `GlowBeauty Web: http://localhost:${port}`
        );
    });
}
