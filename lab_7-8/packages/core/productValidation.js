
// productValidation.js
// Спільні правила перевірки косметичних засобів.
export const MAX_PRODUCT_LENGTH = 500;

export const ERROR_EMPTY =
    "Будь ласка, введіть назву косметичного засобу.";

export const ERROR_TOO_LONG =
    `Назва косметичного засобу не повинна перевищувати ${MAX_PRODUCT_LENGTH} символів.`;

// Перевірка назви косметичного засобу
export function validateProductText(text) {
    if (typeof text !== "string" || text.trim() === "") {
        return {
            isValid: false,
            error: ERROR_EMPTY
        };
    }

    if (text.trim().length > MAX_PRODUCT_LENGTH) {
        return {
            isValid: false,
            error: ERROR_TOO_LONG
        };
    }

    return {
        isValid: true,
        error: null
    };
}
