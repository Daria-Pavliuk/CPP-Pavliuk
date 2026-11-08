
import { test } from "node:test";
import assert from "node:assert/strict";

import {
    createAppServer,
    resolveFilePath
} from "../server.js";

// Тест 1
test("resolveFilePath дозволяє головну сторінку та модулі ядра", () => {
    assert.ok(
        resolveFilePath("/").endsWith("index.html")
    );

    assert.ok(
        resolveFilePath("/style.css").endsWith("style.css")
    );

    assert.ok(
        resolveFilePath(
            "/node_modules/@glowbeauty/core/index.js"
        ).endsWith("index.js")
    );

    assert.ok(
        resolveFilePath(
            "/node_modules/@glowbeauty/core/productsService.js"
        ).endsWith("productsService.js")
    );
});

// Тест 2
test("resolveFilePath забороняє серверні файли та небезпечні шляхи", () => {
    assert.equal(resolveFilePath("/../package.json"), null);

    assert.equal(resolveFilePath("/server.js"), null);

    assert.equal(resolveFilePath("/package.json"), null);

    assert.equal(resolveFilePath("/%E0%A4%A"), null);

    assert.equal(
        resolveFilePath(
            "/node_modules/@glowbeauty/core/../../../../etc/passwd"
        ),
        null
    );

    assert.equal(
        resolveFilePath(
            "/node_modules/@glowbeauty/core/test/productsService.test.js"
        ),
        null
    );
});

// Тест 3
test("HTTP-сервер повертає правильні відповіді та типи файлів", async () => {
    const server = createAppServer();

    await new Promise(resolve => {
        server.listen(0, "127.0.0.1", resolve);
    });

    const { port } = server.address();

    const baseUrl = `http://127.0.0.1:${port}`;

    try {
        // Перевірка головної сторінки
        const page = await fetch(`${baseUrl}/`);

        assert.equal(page.status, 200);

        assert.match(
            page.headers.get("content-type"),
            /text\/html/
        );

        // Перевірка JavaScript-модуля ядра
        const core = await fetch(
            `${baseUrl}/node_modules/@glowbeauty/core/index.js`
        );

        assert.equal(core.status, 200);

        assert.match(
            core.headers.get("content-type"),
            /text\/javascript/
        );

        // Перевірка забороненого файлу
        const forbidden = await fetch(
            `${baseUrl}/server.js`
        );

        assert.equal(forbidden.status, 404);

        // Перевірка відсутнього файлу
        const missing = await fetch(
            `${baseUrl}/unknown.js`
        );

        assert.equal(missing.status, 404);

    } finally {
        await new Promise((resolve, reject) => {
            server.close(error => {
                if (error) reject(error);
                else resolve();
            });
        });
    }
});
