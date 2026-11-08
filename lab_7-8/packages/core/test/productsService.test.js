
import { test } from "node:test";
import assert from "node:assert/strict";

import { ProductsService } from "../productsService.js";
import { MemoryStorageAdapter } from "../storageAdapter.js";
import { ERROR_EMPTY } from "../productValidation.js";

const FIXED_NOW = new Date("2026-11-03T10:00:00.000Z");

function createService(initialProducts = []) {
    const adapter = new MemoryStorageAdapter(initialProducts);

    return {
        adapter,
        service: new ProductsService(adapter, {
            now: () => FIXED_NOW
        })
    };
}

test("add зберігає декоративний косметичний засіб", async () => {
    const { adapter, service } = createService();

    const result = await service.add("  Матова помада  ");

    assert.equal(result.ok, true);
    assert.equal(result.product.text, "Матова помада");
    assert.equal((await adapter.load()).length, 1);
});

test("add відхиляє порожню назву косметичного засобу", async () => {
    const { adapter, service } = createService();

    assert.deepEqual(
        await service.add("   "),
        { ok: false, error: ERROR_EMPTY }
    );

    assert.equal((await adapter.load()).length, 0);
});

test("add створює унікальні ID навіть за однакового часу", async () => {
    const { service } = createService();

    const first = await service.add("Рідка помада");
    const second = await service.add("Туш для вій");

    assert.notEqual(first.product.id, second.product.id);
});

test("remove видаляє декоративну косметику за ID", async () => {
    const { service } = createService([
        { id: 1, text: "Помада" },
        { id: 2, text: "Туш для вій" }
    ]);

    assert.deepEqual(await service.remove(1), { ok: true });
    assert.deepEqual(
        (await service.list()).map(product => product.id),
        [2]
    );
});
test("remove повідомляє, якщо товар відсутній", async () => {
    const { service } = createService([
        { id: 1, text: "Помада" }
    ]);
    const result = await service.remove(99);
    assert.deepEqual(result, {
        ok: false,
        error: "Косметичний засіб не знайдено."
    });
});

test("list сортує декоративну косметику та підтримує пошук", async () => {
    const { service } = createService([
        {
            id: 1,
            text: "Матова помада",
            createdAt: "2026-01-01T00:00:00.000Z"
        },
        {
            id: 2,
            text: "Палетка тіней",
            createdAt: "2026-06-01T00:00:00.000Z"
        }
    ]);
    assert.deepEqual(
        (await service.list()).map(product => product.id),
        [2, 1]
    );
    assert.deepEqual(
        (await service.list("помада")).map(product => product.id),
        [1]
    );
});
test("list ігнорує некоректні записи у сховищі", async () => {
    const { service } = createService([
        { id: 1, text: "Рум'яна" },
        { id: "x", text: "Некоректний товар" },
        null
    ]);

    assert.deepEqual(
        (await service.list()).map(product => product.id),
        [1]
    );
});
