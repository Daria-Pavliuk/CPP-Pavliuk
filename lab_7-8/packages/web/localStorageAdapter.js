
// localStorageAdapter.js
// Адаптер збереження косметичних засобів у браузері.

import { ProductStorageAdapter } from "@glowbeauty/core";

export const STORAGE_KEY = "glowbeauty-products";

export class LocalStorageAdapter extends ProductStorageAdapter {
    constructor(storage = globalThis.localStorage, key = STORAGE_KEY) {
        super();
        this.storage = storage;
        this.key = key;
    }

    // Завантаження товарів із localStorage
    async load() {
        const raw = this.storage.getItem(this.key);

        if (raw === null) {
            return [];
        }

        try {
            const data = JSON.parse(raw);
            return Array.isArray(data) ? data : [];
        } catch {
            // Пошкоджений JSON не повинен ламати застосунок
            return [];
        }
    }

    // Збереження товарів у форматі JSON
    async save(products) {
        this.storage.setItem(this.key, JSON.stringify(products));
    }
}
