
// renderer/script.js
// Інтерфейс десктопного клієнта GlowBeauty.
// Усі операції виконуються через window.productsAPI.

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
// Відображення косметичних засобів
async function renderProducts() {
    const products = await window.productsAPI.list(
        searchInput.value
    );
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
            "Додано: " + product.dateLabel;
        content.append(productName, productDate);
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Видалити";
        deleteButton.addEventListener("click", async () => {
            const result = await window.productsAPI.remove(
                product.id
            );
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
    const result = await window.productsAPI.add(
        productInput.value
    );
    if (!result.ok) {
        showMessage(result.error, "error");
        return;
    }
    productInput.value = "";

    await renderProducts();
    showMessage(
        "Косметичний засіб успішно додано та збережено у файл!",
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
// Завантаження товарів під час відкриття застосунку
window.addEventListener("DOMContentLoaded", renderProducts);
