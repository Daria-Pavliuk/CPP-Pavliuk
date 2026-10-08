function Header({ total, available }) {
    return (
        <header>
            <h1 className="mb-2 text-center text-3xl font-bold text-rose-600">
                GlowBeauty
            </h1>
            <p className="mb-5 text-center text-slate-600">
                Усього товарів: {total} · В наявності: {available}
            </p>
        </header>
    );
}

export default Header;