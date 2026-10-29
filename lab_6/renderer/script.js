'use strict';

const itemInput = document.getElementById('itemInput');
const addItemButton = document.getElementById('addItemButton');
const itemsList = document.getElementById('itemsList');
const message = document.getElementById('message');

let items = [];
let busy = false;
let nextId = Date.now();

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}

function setBusy(value) {
  busy = value;
  addItemButton.disabled = value;
  itemsList.querySelectorAll('button').forEach(button => { button.disabled = value; });
}

function renderItems() {
  itemsList.replaceChildren();
  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'item-row';
    const span = document.createElement('span');
    span.className = 'item-text';
    span.textContent = item.text;
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-button';
    deleteBtn.textContent = 'Видалити';
    deleteBtn.type = 'button';
    deleteBtn.disabled = busy;
    deleteBtn.addEventListener('click', () => deleteItem(item.id));
    li.append(span, deleteBtn);
    itemsList.appendChild(li);
  }
}

async function persist(nextItems, successMessage) {
  if (busy) return false;
  setBusy(true);
  try {
    await window.wishlistAPI.saveItems(nextItems);
    items = nextItems;
    renderItems();
    showMessage(successMessage, '#2e7d32');
    return true;
  } catch (error) {
    console.error('Помилка збереження Wishlist:', error);
    showMessage('Не вдалося зберегти Wishlist у файл.', '#d1497b');
    return false;
  } finally {
    setBusy(false);
  }
}

async function deleteItem(id) {
  await persist(items.filter(item => item.id !== id), 'Товар видалено з кошика та файлу.');
}

async function addItem() {
  if (busy) return;
  const text = itemInput.value.trim();
  if (!text) {
    showMessage('Будь ласка, введіть назву косметичного засобу.', '#d1497b');
    return;
  }
  const id = Math.max(Date.now(), nextId + 1);
  nextId = id;
  const saved = await persist([...items, { id, text }], 'Товар успішно додано та збережено у файл!');
  if (saved) {
    itemInput.value = '';
    itemInput.focus();
  }
}

addItemButton.addEventListener('click', addItem);
itemInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addItem();
  }
});

async function initialize() {
  setBusy(true);
  try {
    const loaded = await window.wishlistAPI.loadItems();
    items = Array.isArray(loaded) ? loaded : [];
    nextId = Math.max(Date.now(), ...items.map(item => item.id));
    renderItems();
  } catch (error) {
    console.error('Помилка завантаження Wishlist:', error);
    showMessage('Не вдалося завантажити збережені товари.', '#d1497b');
  } finally {
    setBusy(false);
  }
}

initialize();
