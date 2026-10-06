// Тимчасове сховище користувачів (без бази даних).
export const users = [];
let nextUserId = 1;

// Повертає новий унікальний id користувача.
export function getNextUserId() {
    const id = String(nextUserId);
    nextUserId += 1;
    return id;
}

// Тимчасове сховище для косметики.
export const cosmetics = [];
let nextCosmeticId = 1;

// Повертає новий унікальний id для косметики.
export function getNextCosmeticId() {
    const id = String(nextCosmeticId);
    nextCosmeticId += 1;
    return id;
}