import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import Pagination from "../components/Pagination.jsx";
import LoginModal from "../components/LoginModal.jsx";

const LIMIT = 12;

export default function Products() {
    const [q, setQ] = useState("");
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sort, setSort] = useState("newest"); // newest|price_asc|price_desc|name_asc|name_desc

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    const [showLogin, setShowLogin] = useState(false);

    async function fetchFilters() {
        try {
            const [b, c] = await Promise.all([
                fetch("/api/catalog/brands", { credentials: "include" }).then(r => r.json()),
                fetch("/api/catalog/categories", { credentials: "include" }).then(r => r.json()),
            ]);
            setBrands(b || []);
            setCategories(c || []);
        } catch {
            // silencieux
        }
    }

    async function fetchProducts(newOffset = 0) {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (brandId) params.set("brandId", brandId);
        if (categoryId) params.set("categoryId", categoryId);
        params.set("limit", String(LIMIT));
        params.set("offset", String(newOffset));

        const res = await fetch(`/api/catalog/products?${params.toString()}`, { credentials: "include" });
        if (!res.ok) {
            console.error(await res.text());
            return;
        }
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
        setOffset(data.offset || 0);
    }

    useEffect(() => {
        fetchFilters();
        fetchProducts(0);
    }, []);

    // tri client (l’API ne supporte pas encore le tri)
    const sortedItems = useMemo(() => {
        const arr = [...items];
        const getPrice = (p) => {
            const v0 = p.variants?.[0];
            return v0?.price ? Number(v0.price) : (p.basePrice ? Number(p.basePrice) : 0);
        };
        switch (sort) {
            case "price_asc":  return arr.sort((a, b) => getPrice(a) - getPrice(b));
            case "price_desc": return arr.sort((a, b) => getPrice(b) - getPrice(a));
            case "name_asc":   return arr.sort((a, b) => a.name.localeCompare(b.name));
            case "name_desc":  return arr.sort((a, b) => b.name.localeCompare(a.name));
            case "newest":
            default:
                return arr; // déjà renvoyé desc par createdAt côté API
        }
    }, [items, sort]);

    const onSearch = (e) => {
        e?.preventDefault();
        fetchProducts(0);
    };

    const onPageChange = (pageIndex) => {
        const newOffset = pageIndex * LIMIT;
        fetchProducts(newOffset);
    };

    return (
        <div>
            <h1>Produits</h1>

            <form onSubmit={onSearch} style={{ display: "grid", gridTemplateColumns: "1fr 180px 220px 160px 120px", gap: 8, alignItems: "center" }}>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un produit..." />
                <select value={brandId} onChange={e => setBrandId(e.target.value)}>
                    <option value="">Toutes marques</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    <option value="">Toutes catégories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="newest">Nouveautés</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="name_asc">Nom A→Z</option>
                    <option value="name_desc">Nom Z→A</option>
                </select>
                <button type="submit">Filtrer</button>
            </form>

            <p style={{ marginTop: 8 }}>{total} produit(s)</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                {sortedItems.map(p =>
                    <ProductCard key={p.id} product={p} onNeedLogin={() => setShowLogin(true)} />
                )}
            </div>

            <Pagination total={total} limit={LIMIT} offset={offset} onChange={onPageChange} />

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />}
        </div>
    );
}
