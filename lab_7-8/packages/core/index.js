
// index.js
// Публічний API спільного ядра GlowBeauty.

// Правила перевірки косметичних засобів
export {
    MAX_PRODUCT_LENGTH,
    ERROR_EMPTY,
    ERROR_TOO_LONG,
    validateProductText
} from "./productValidation.js";

// Допоміжні функції
export {
    createProduct,
    formatProductDate,
    sortProductsByDate,
    filterProductsByQuery,
    sanitizeProducts
} from "./productUtils.js";

// Адаптери збереження
export {
    ProductStorageAdapter,
    MemoryStorageAdapter
} from "./storageAdapter.js";

// Сервіс керування косметичними засобами
export {
    ProductsService
} from "./productsService.js";
