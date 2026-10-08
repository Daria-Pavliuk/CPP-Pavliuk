import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import CosmeticForm from "./components/CosmeticForm.jsx";
import CosmeticList from "./components/CosmeticList.jsx";

const STORAGE_KEY = "cosmetics-store";

// Читаємо збережені товари з localStorage (або повертаємо порожній масив)
function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [products, setProducts] = useState(loadProducts);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Стан для пошуку

  // Зберігаємо товари щоразу, коли змінюється масив products
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Функція додавання товару
  function addProduct(productData) {
    const trimmedName = productData.name.trim();

    // Валідація: перевіряємо, чи не порожні поля назви та дати
    if (trimmedName === "" || productData.expiryDate === "") {
      setMessage({ text: "Заповніть назву та вкажіть термін придатності.", type: "error" });
      return false;
    }

    const newProduct = {
      id: Date.now(),
      name: trimmedName,
      category: productData.category,
      expiryDate: productData.expiryDate,
      isSold: false, // За замовчуванням товар у наявності
    };

    setProducts([...products, newProduct]);
    setMessage({ text: "Товар успішно додано.", type: "success" });
    return true;
  }

  // Функція перемикання стану (в наявності / продано)
  function toggleProduct(id) {
    setProducts(
        products.map((product) =>
            product.id === id ? { ...product, isSold: !product.isSold } : product
        )
    );
  }

  // Функція видалення товару
  function deleteProduct(id) {
    setProducts(products.filter((product) => product.id !== id));
    setMessage({ text: "Товар видалено зі списку.", type: "success" });
  }

  // Обчислюємо кількість товарів, які ще в наявності (не продані)
  const availableCount = products.filter((product) => !product.isSold).length;

  // Фільтрація товарів «на льоту» для рядка пошуку
  const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="min-h-screen bg-rose-50 px-4 py-8 text-slate-800">
        <main className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
          <Header total={products.length} available={availableCount} />

          {/* Поле пошуку */}
          <div className="mb-6">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Пошук продукту за назвою..."
                aria-label="Пошук"
                className="w-full rounded-lg border border-rose-300 bg-rose-50/50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <CosmeticForm onAdd={addProduct} />

          {/* Відображення повідомлень (помилка або успіх) */}
          {message && (
              <p
                  className={
                    message.type === "error"
                        ? "mb-4 font-bold text-rose-600"
                        : "mb-4 font-bold text-emerald-600"
                  }
              >
                {message.text}
              </p>
          )}

          <CosmeticList
              products={filteredProducts}
              onToggle={toggleProduct}
              onDelete={deleteProduct}
          />
        </main>
      </div>
  );
}

export default App;