
import { test } from "node:test";
import assert from "node:assert/strict";

import {
    createProduct,
    formatProductDate,
    sortProductsByDate,
    filterProductsByQuery,
    sanitizeProducts
} from "../productUtils.js";

test("createProduct створює товар із назвою та датою", () => {
    const now = new Date("2026-11-03T10:00:00.000Z");

    assert.deepEqual(
        createProduct("  Рідка матова помада  ", { id: 7, now }),
        {
            id: 7,
            text: "Рідка матова помада",
            createdAt: "2026-11-03T10:00:00.000Z"
        }
    );
});

test("formatProductDate форматує дату як дд.мм.рррр", () => {
    assert.equal(
        formatProductDate(new Date(2026, 10, 3, 12, 0)),
        "03.11.2026"
    );
});

test("formatProductDate повертає порожній рядок для некоректної дати", () => {
    assert.equal(formatProductDate("не дата"), "");
});

test("sortProductsByDate сортує товари та не змінює вихідний масив", () => {
    const products = [
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
    ];

    const sorted = sortProductsByDate(products);

    assert.deepEqual(
        sorted.map(product => product.id),
        [2, 1]
    );

    assert.deepEqual(
        products.map(product => product.id),
        [1, 2]
    );
});

test("sortProductsByDate підтримує записи без createdAt", () => {
    const products = [
        { id: 100, text: "Помада" },
        { id: 200, text: "Туш для вій" }
    ];

    assert.deepEqual(
        sortProductsByDate(products).map(product => product.id),
        [200, 100]
    );
});

test("filterProductsByQuery шукає без урахування регістру", () => {
    const products = [
        { id: 1, text: "Матова Помада" },
        { id: 2, text: "Туш для вій" }
    ];

    assert.deepEqual(
        filterProductsByQuery(products, "помада"),
        [products[0]]
    );

    assert.deepEqual(
        filterProductsByQuery(products, "   "),
        products
    );
});

test("sanitizeProducts видаляє некоректні записи", () => {
    const products = [
        { id: 1, text: "Пудра для обличчя" },
        { id: "2", text: "Туш для вій" },
        { id: 3, text: "   " },
        null,
        "Некоректний запис"
    ];

    assert.deepEqual(
        sanitizeProducts(products),
        [{ id: 1, text: "Пудра для обличчя" }]
    );

    assert.deepEqual(sanitizeProducts({ id: 1 }), []);
});
