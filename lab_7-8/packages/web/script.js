
// script.js
// Інтерфейс веб-клієнта GlowBeauty.
// Бізнес-логіка знаходиться у спільному ядрі.

import {
    ProductsService,
    formatProductDate
} from "@glowbeauty/core";

import { LocalStorageAdapter } from "./localStorageAdapter.js";

// Створення сервісу зі сховищем браузера
const service = new ProductsService(
    new LocalStorageAdapter()
);

// Елементи сторінки
const productInput = document.getElementById("productInput");
const addProductButton = document.getElementById("addProductButton");
const searchInput = document.getElementById("searchInput");
const productsList = document.getElementById("productsList");
const emptyMessage = document.getElementById("emptyMessage");
const message = document.getElementById("message");

// Відображення повідомлень
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

// Відображення списку косметичних засобів
async function renderProducts() {
    const products = await service.list(searchInput.value);

    productsList.innerHTML = "";

    emptyMessage.style.display =
        products.length === 0 ? "block" : "none";

    for (const product of products) {
        const productItem = document.createElement("li");
        productItem.className = "product-item";

        const content = document.createElement("div");
        content.className = "product-content";

        const productName = document.createElement("span");
        productName.className = "product-name";
        productName.textContent = product.text;

        const productDate = document.createElement("span");
        productDate.className = "product-date";

        productDate.textContent =
            "Додано: " +
            formatProductDate(product.createdAt ?? product.id);

        content.append(productName, productDate);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Видалити";

        deleteButton.addEventListener("click", async () => {
            const result = await service.remove(product.id);
            if (!result.ok) {
                showMessage(result.error, "error");
                return;
            }
            await renderProducts();
            showMessage(
                "Косметичний засіб успішно видалено.",
                "success"
            );
        });
        productItem.append(content, deleteButton);
        productsList.appendChild(productItem);
    }
}
// Додавання косметичного засобу
async function addProduct() {
    const result = await service.add(productInput.value);
    if (!result.ok) {
        showMessage(result.error, "error");
        return;
    }

    productInput.value = "";

    await renderProducts();

    showMessage(
        "Косметичний засіб успішно додано!",
        "success"
    );
}

// Обробники подій
addProductButton.addEventListener("click", addProduct);

productInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addProduct();
    }
});

searchInput.addEventListener("input", renderProducts);

// Початкове завантаження списку
renderProducts();
