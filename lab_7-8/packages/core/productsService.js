
// productsService.js
// Спільна бізнес-логіка застосунку GlowBeauty.

import { validateProductText } from "./productValidation.js";

import {
    createProduct,
    filterProductsByQuery,
    sanitizeProducts,
    sortProductsByDate
} from "./productUtils.js";

export class ProductsService {
    constructor(adapter, { now = () => new Date() } = {}) {
        this.adapter = adapter;
        this.now = now;
    }

    // Отримання списку косметичних засобів
    // із пошуком та сортуванням за датою
    async list(query = "") {
        const products = sanitizeProducts(
            await this.adapter.load()
        );

        return sortProductsByDate(
            filterProductsByQuery(products, query)
        );
    }

    // Додавання косметичного засобу
    async add(text) {
        const validation = validateProductText(text);

        if (!validation.isValid) {
            return {
                ok: false,
                error: validation.error
            };
        }

        const products = sanitizeProducts(
            await this.adapter.load()
        );

        const now = this.now();

        const lastId = products.reduce(
            (max, product) => Math.max(max, product.id),
            0
        );

        // Забезпечення унікальності ідентифікатора
        const product = createProduct(text, {
            id: Math.max(now.getTime(), lastId + 1),
            now
        });

        await this.adapter.save([...products, product]);

        return {
            ok: true,
            product
        };
    }

    // Видалення косметичного засобу за ID
    async remove(id) {
        const products = sanitizeProducts(
            await this.adapter.load()
        );

        const remainingProducts = products.filter(
            product => product.id !== id
        );

        if (remainingProducts.length === products.length) {
            return {
                ok: false,
                error: "Косметичний засіб не знайдено."
            };
        }

        await this.adapter.save(remainingProducts);

        return {
            ok: true
        };
    }
}
