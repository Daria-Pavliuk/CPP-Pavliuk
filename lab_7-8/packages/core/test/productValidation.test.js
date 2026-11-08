
import { test } from "node:test";
import assert from "node:assert/strict";

import {
    validateProductText,
    MAX_PRODUCT_LENGTH,
    ERROR_EMPTY,
    ERROR_TOO_LONG
} from "../productValidation.js";

test("Коректна назва декоративної косметики проходить перевірку", () => {
    assert.deepEqual(
        validateProductText("Рідка матова помада"),
        { isValid: true, error: null }
    );
});

test("Порожня назва та самі пробіли не проходять перевірку", () => {
    assert.deepEqual(
        validateProductText(""),
        { isValid: false, error: ERROR_EMPTY }
    );

    assert.deepEqual(
        validateProductText("    "),
        { isValid: false, error: ERROR_EMPTY }
    );
});

test("Некоректний тип даних не проходить перевірку", () => {
    assert.equal(validateProductText(undefined).isValid, false);
    assert.equal(validateProductText(42).isValid, false);
    assert.equal(validateProductText(null).isValid, false);
});

test("Перевірка максимально допустимої довжини назви товару", () => {
    assert.equal(
        validateProductText("а".repeat(MAX_PRODUCT_LENGTH)).isValid,
        true
    );

    assert.deepEqual(
        validateProductText("а".repeat(MAX_PRODUCT_LENGTH + 1)),
        { isValid: false, error: ERROR_TOO_LONG }
    );
});
