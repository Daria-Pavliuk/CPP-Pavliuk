
// storageAdapter.js
// Спільний інтерфейс для збереження косметичних засобів.

export class ProductStorageAdapter {
    // Завантаження збережених косметичних засобів
    async load() {
        throw new Error("Метод load() не реалізовано");
    }

    // Збереження масиву косметичних засобів
    async save(products) {
        throw new Error("Метод save() не реалізовано");
    }
}
// Адаптер для тимчасового збереження даних у пам'яті
// Використовується для тестування спільного ядра
export class MemoryStorageAdapter extends ProductStorageAdapter {
    constructor(initialProducts = []) {
        super();
        this.products = [...initialProducts];
    }
    async load() {
        return [...this.products];
    }
    async save(products) {
        this.products = [...products];
    }
}
