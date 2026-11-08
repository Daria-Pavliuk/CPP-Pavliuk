
import { test } from "node:test";
import assert from "node:assert/strict";

import {
    MemoryStorageAdapter,
    ProductsService
} from "@glowbeauty/core";

import {
    createHandlers
} from "../ipcHandlers.js";

// Створення тестових IPC-обробників
function createTestHandlers(initialProducts = []) {
    const adapter = new MemoryStorageAdapter(
        initialProducts
    );

    const service = new ProductsService(adapter);

    return createHandlers(service);
}

// Тест 1
test("add і list додають товар та повертають дату dateLabel", async () => {
    const handlers = createTestHandlers();

    const result = await handlers.add("Матова помада");

    const products = await handlers.list("");

    assert.equal(result.ok, true);
    assert.equal(products.length, 1);
    assert.equal(products[0].text, "Матова помада");

    assert.match(
        products[0].dateLabel,
        /^\d{2}\.\d{2}\.\d{4}$/
    );
});

// Тест 2
test("add відхиляє порожні та некоректні значення", async () => {
    const handlers = createTestHandlers();

    assert.equal(
        (await handlers.add("   ")).ok,
        false
    );

    assert.equal(
        (await handlers.add(42)).ok,
        false
    );

    assert.equal(
        (await handlers.add(undefined)).ok,
        false
    );
});

// Тест 3
test("list підтримує пошук і обробляє некоректний запит", async () => {
    const handlers = createTestHandlers([
        { id: 1, text: "Матова помада" },
        { id: 2, text: "Палетка тіней" },
        { id: 3, text: "Туш для вій" }
    ]);

    // Некоректний запит не повинен ламати застосунок
    assert.equal(
        (await handlers.list({ invalid: true })).length,
        3
    );

    // Пошук без урахування регістру
    const results = await handlers.list("ПОМАДА");

    assert.equal(results.length, 1);
    assert.equal(results[0].text, "Матова помада");
});

// Тест 4
test("remove видаляє товар та перевіряє коректність ID", async () => {
    const handlers = createTestHandlers([
        { id: 1, text: "Рум'яна" },
        { id: 2, text: "Пудра" }
    ]);

    // Видалення наявного товару
    assert.equal(
        (await handlers.remove(1)).ok,
        true
    );

    // Відхилення рядкового ID
    assert.equal(
        (await handlers.remove("2")).ok,
        false
    );

    // Відхилення відсутнього ID
    assert.equal(
        (await handlers.remove(99)).ok,
        false
    );

    // Видалення другого товару
    assert.equal(
        (await handlers.remove(2)).ok,
        true
    );

    assert.deepEqual(
        await handlers.list(""),
        []
    );
});
