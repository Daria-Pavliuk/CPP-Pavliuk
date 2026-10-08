function CosmeticItem({ product, onToggle, onDelete }) {
    return (
        <li
            className={
                product.isSold
                    ? "flex items-center justify-between gap-3 rounded-lg bg-slate-200 p-3"
                    : "flex items-center justify-between gap-3 rounded-lg bg-rose-50 p-3"
            }
        >
            <label className="flex flex-1 cursor-pointer items-center gap-3">
                <input
                    type="checkbox"
                    className="h-5 w-5 accent-rose-600"
                    checked={product.isSold}
                    onChange={() => onToggle(product.id)}
                />

                {/* Контейнер для відображення всіх полів товару */}
                <div
                    className={
                        product.isSold
                            ? "flex flex-col break-words text-slate-500 line-through"
                            : "flex flex-col break-words text-slate-800"
                    }
                >
                    <span className="text-lg font-bold">{product.name}</span>
                    <span className="text-sm opacity-80">
            {product.category} | До: {product.expiryDate}
          </span>
                </div>
            </label>

            <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="cursor-pointer rounded-lg bg-rose-500 px-3.5 py-2 text-white hover:bg-rose-700"
            >
                Видалити
            </button>
        </li>
    );
}

export default CosmeticItem;