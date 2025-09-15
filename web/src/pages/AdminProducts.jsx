import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function AdminProducts() {
    const [q, setQ] = useState("");
    const [list, setList] = useState([]);
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({ name: "", sku: "", isActive: true });

    useEffect(() => {
        (async () => {
            const [b, c] = await Promise.all([api("admin/brands"), api("admin/categories")]);
            setBrands(b); setCategories(c);
            search();
        })();
    }, []);

    const search = async () => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (brandId) params.set("brandId", brandId);
        if (categoryId) params.set("categoryId", categoryId);
        const data = await api(`admin/products?${params.toString()}`);
        setList(data.items);
    };

    const create = async (e) => {
        e.preventDefault();
        const payload = { ...form, brandId: brandId ? Number(brandId) : undefined, categoryId: categoryId ? Number(categoryId) : undefined };
        await api("admin/products", { method: "POST", body: JSON.stringify(payload) });
        setForm({ name: "", sku: "", isActive: true });
        search();
    };

    const toggleActive = async (p) => {
        await api(`admin/products/${p.id}`, { method: "PATCH", body: JSON.stringify({ isActive: !p.isActive }) });
        search();
    };

    return (
        <div>
            <h1>Admin · Produits</h1>

            <form onSubmit={create} style={{ display: "grid", gap: 6, maxWidth: 500 }}>
                <h3>Nouveau produit</h3>
                <input placeholder="Nom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <input placeholder="SKU (optionnel)" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
                <select value={brandId} onChange={e => setBrandId(e.target.value)}>
                    <option value="">Marque (optionnel)</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    <option value="">Catégorie (optionnel)</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <label><input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Actif</label>
                <button type="submit">Créer</button>
            </form>

            <hr style={{ margin: "16px 0" }} />

            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher..." />
                <button onClick={search}>Filtrer</button>
            </div>

            <table width="100%" cellPadding="6" style={{ borderCollapse: "collapse" }}>
                <thead><tr><th>ID</th><th>Nom</th><th>SKU</th><th>Actif</th><th>Actions</th></tr></thead>
                <tbody>
                {list.map(p => (
                    <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.sku || "-"}</td>
                        <td>{p.isActive ? "Oui" : "Non"}</td>
                        <td>
                            <button onClick={() => toggleActive(p)}>{p.isActive ? "Désactiver" : "Activer"}</button>
                            {/* tu peux ajouter ici boutons Variantes/Images plus tard */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
