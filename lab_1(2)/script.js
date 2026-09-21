const itemInput = document.getElementById("itemInput");
const addItemButton = document.getElementById("addItemButton");
const itemsList = document.getElementById("itemsList");
const message = document.getElementById("message");

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

function createItemElement(itemName) {
    const li = document.createElement("li");
    li.className = "item-row";

    const span = document.createElement("span");
    span.className = "item-text";
    span.textContent = itemName;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-button";
    deleteBtn.textContent = "Видалити";

    deleteBtn.addEventListener("click", function () {
        li.remove();
        showMessage("Товар видалено з кошика.", "#d1497b");
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

function addItem() {
    const itemName = itemInput.value.trim();

    if (itemName === "") {
        showMessage("Будь ласка, введіть назву косметичного засобу.", "#d1497b");
        return;
    }

    const itemElement = createItemElement(itemName);
    itemsList.appendChild(itemElement);

    itemInput.value = "";
    itemInput.focus();

    showMessage("Товар успішно додано до вашого Wishlist!", "#2e7d32");
}

addItemButton.addEventListener("click", addItem);

itemInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
});