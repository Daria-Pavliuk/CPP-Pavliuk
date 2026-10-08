import CosmeticItem from "./CosmeticItem.jsx";

function CosmeticList({ products, onToggle, onDelete }) {
    // Якщо масив товарів порожній (немає доданих або нічого не знайдено в пошуку)
    if (products.length === 0) {
        return (
            <p className="text-center text-slate-500">
                Товарів поки немає або нічого не знайдено. Додайте перший продукт!
            </p>
        );
    }

    return (
        <ul className="space-y-3">
            {/* Проходимося по масиву товарів і для кожного рендеримо CosmeticItem */}
            {products.map((product) => (
                <CosmeticItem
                    key={product.id}
                    product={product}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

export default CosmeticList;