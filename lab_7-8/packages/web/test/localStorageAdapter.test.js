
import { test } from "node:test";
import assert from "node:assert/strict";

import { ProductsService } from "@glowbeauty/core";

import {
    LocalStorageAdapter,
    STORAGE_KEY
} from "../localStorageAdapter.js";

// Імітація браузерного localStorage
function createFakeStorage(initial = {}) {
    const data = { ...initial };

    return {
        data,

        getItem: (key) =>
            key in data ? data[key] : null,

        setItem: (key, value) => {
            data[key] = String(value);
        }
    };
}

// Тест 1
test("load повертає порожній масив для порожнього сховища", async () => {
    const adapter = new LocalStorageAdapter(
        createFakeStorage()
    );

    assert.deepEqual(await adapter.load(), []);
});

// Тест 2
test("save записує косметичні засоби у JSON, а load читає їх", async () => {
    const storage = createFakeStorage();
    const adapter = new LocalStorageAdapter(storage);

    const products = [
        { id: 1, text: "Матова помада" },
        { id: 2, text: "Палетка тіней" }
    ];

    await adapter.save(products);

    assert.equal(
        storage.data[STORAGE_KEY],
        JSON.stringify(products)
    );

    assert.deepEqual(await adapter.load(), products);
});

// Тест 3
test("load обробляє пошкоджений JSON та некоректний формат", async () => {
    const broken = new LocalStorageAdapter(
        createFakeStorage({
            [STORAGE_KEY]: "{неправильний json"
        })
    );

    const notArray = new LocalStorageAdapter(
        createFakeStorage({
            [STORAGE_KEY]: '{"product":"Помада"}'
        })
    );

    assert.deepEqual(await broken.load(), []);
    assert.deepEqual(await notArray.load(), []);
});

// Тест 4
test("LocalStorageAdapter працює зі спільним ProductsService", async () => {
    const storage = createFakeStorage();

    const service = new ProductsService(
        new LocalStorageAdapter(storage)
    );

    const added = await service.add("  Рідкі рум'яна  ");

    assert.equal(added.ok, true);
    assert.equal(added.product.text, "Рідкі рум'яна");

    const products = await service.list();

    assert.equal(products.length, 1);

    const removed = await service.remove(added.product.id);

    assert.equal(removed.ok, true);
    assert.deepEqual(await service.list(), []);
});
