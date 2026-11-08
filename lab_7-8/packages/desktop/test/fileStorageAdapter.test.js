
import { test } from "node:test";
import assert from "node:assert/strict";

import {
    mkdtemp,
    readFile,
    writeFile,
    rm
} from "node:fs/promises";

import { tmpdir } from "node:os";
import { join } from "node:path";

import { ProductsService } from "@glowbeauty/core";

import {
    FileStorageAdapter
} from "../fileStorageAdapter.js";

// Створення тимчасового файлу для тестування
async function createTempFile(t) {
    const dir = await mkdtemp(
        join(tmpdir(), "glowbeauty-")
    );

    t.after(async () => {
        await rm(dir, { recursive: true, force: true });
    });

    return join(dir, "data", "products.json");
}

// Тест 1
test("load повертає порожній масив, якщо файлу немає", async t => {
    const filePath = await createTempFile(t);

    const adapter = new FileStorageAdapter(filePath);

    assert.deepEqual(await adapter.load(), []);
});

// Тест 2
test("save створює папку та файл, а load читає товари", async t => {
    const filePath = await createTempFile(t);

    const adapter = new FileStorageAdapter(filePath);

    const products = [
        { id: 1, text: "Матова помада" },
        { id: 2, text: "Палетка тіней" }
    ];

    await adapter.save(products);

    const fileContent = await readFile(
        filePath,
        "utf-8"
    );

    assert.deepEqual(
        JSON.parse(fileContent),
        products
    );

    assert.deepEqual(await adapter.load(), products);
});

// Тест 3
test("load повертає порожній масив для пошкодженого JSON", async t => {
    const filePath = await createTempFile(t);

    const adapter = new FileStorageAdapter(filePath);

    await adapter.save([]);

    await writeFile(
        filePath,
        "{пошкоджений json",
        "utf-8"
    );

    assert.deepEqual(await adapter.load(), []);
});

// Тест 4
test("FileStorageAdapter працює зі спільним ProductsService", async t => {
    const filePath = await createTempFile(t);

    const adapter = new FileStorageAdapter(filePath);

    const service = new ProductsService(adapter);

    const added = await service.add("Туш для вій");

    assert.equal(added.ok, true);

    // Створюємо новий сервіс з тим самим файлом
    const reopenedService = new ProductsService(
        new FileStorageAdapter(filePath)
    );

    const products = await reopenedService.list();

    assert.equal(products.length, 1);
    assert.equal(products[0].text, "Туш для вій");
});
