
// productUtils.js
// Допоміжні функції для роботи з косметичними засобами.

// Створення нового косметичного засобу
export function createProduct(
    text,
    { id = Date.now(), now = new Date() } = {}
) {
    return {
        id,
        text: text.trim(),
        createdAt: now.toISOString()
    };
}
// Форматування дати у вигляді дд.мм.рррр
export function formatProductDate(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }
    const date = value instanceof Date
        ? value
        : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    return date.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}
// Отримання часу створення товару
function getProductTime(product) {
    const value = product.createdAt ??
        (typeof product.id === "number" ? product.id : 0);
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
}
// Сортування: новіші товари спочатку
export function sortProductsByDate(products) {
    return [...products].sort(
        (a, b) => getProductTime(b) - getProductTime(a)
    );
}
// Пошук косметичних засобів без урахування регістру
export function filterProductsByQuery(products, query = "") {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === "") {
        return [...products];
    }
    return products.filter(product =>
        product.text.toLowerCase().includes(normalizedQuery)
    );
}
// Видалення некоректних записів
export function sanitizeProducts(products) {
    if (!Array.isArray(products)) {
        return [];
    }
    return products.filter(product =>
        product !== null &&
        typeof product === "object" &&
        Number.isSafeInteger(product.id) &&
        typeof product.text === "string" &&
        product.text.trim() !== ""
    );
}
