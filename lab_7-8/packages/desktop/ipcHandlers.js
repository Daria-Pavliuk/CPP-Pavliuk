
// ipcHandlers.js
// Обробники запитів десктопного клієнта GlowBeauty.

import {
    formatProductDate
} from "@glowbeauty/core";

export function createHandlers(service) {
    return {
        // Отримання списку косметичних засобів
        async list(query) {
            const searchQuery =
                typeof query === "string" ? query : "";

            const products = await service.list(searchQuery);

            return products.map(product => ({
                ...product,
                dateLabel: formatProductDate(
                    product.createdAt ?? product.id
                )
            }));
        },

        // Додавання декоративної косметики
        add(text) {
            return service.add(
                typeof text === "string" ? text : ""
            );
        },

        // Видалення косметичного засобу
        remove(id) {
            if (typeof id !== "number" ||
                !Number.isSafeInteger(id)) {
                return {
                    ok: false,
                    error: "Некоректний ідентифікатор товару."
                };
            }

            return service.remove(id);
        }
    };
}
