import { useState } from "react";

function CosmeticForm({ onAdd }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Для обличчя");
    const [expiryDate, setExpiryDate] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const added = onAdd({ name, category, expiryDate });

        if (added) {
            setName("");
            setCategory("Для обличчя");
            setExpiryDate("");
        }
    }
    return (
        <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-3 max-sm:flex-col">
            <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Назва продукту (напр., Тональний крем)"
                aria-label="Назва товару"
                className="flex-1 rounded-lg border border-rose-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label="Категорія товару"
                className="rounded-lg border border-rose-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
                <option value="Для обличчя">Для обличчя (тон, пудра, рум'яна)</option>
                <option value="Для очей">Для очей (туш, тіні, підводка)</option>
                <option value="Для губ">Для губ (помада, блиск, олівець)</option>
                <option value="Для брів">Для брів (олівець, гель, тіні)</option>
            </select>
            <input
                type="date"
                value={expiryDate}
                onChange={(event) => setExpiryDate(event.target.value)}
                aria-label="Термін придатності"
                className="rounded-lg border border-rose-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
                type="submit"
                className="cursor-pointer rounded-lg bg-rose-600 px-5 py-3 text-base text-white transition-colors hover:bg-rose-800"
            >
                Додати
            </button>
        </form>
    );
}

export default CosmeticForm;