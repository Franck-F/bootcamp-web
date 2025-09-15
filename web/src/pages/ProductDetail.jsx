import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoginModal from "../components/LoginModal.jsx";

export default function ProductDetail() {
    const { id } = useParams();
    const [p, setP] = useState(null);
    const [variantId, setVariantId] = useState("");
    const [qty, setQty] = useState(1);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/catalog/products/${id}`, { credentials: "include" });
            if (res.ok) setP(await res.json());
        })();
    }, [id]);

    const addToCart = async () => {
        if (!variantId) { alert("Choisissez une variante"); return; }
        const res = await fetch("/api/cart", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productVariantId: Number(variantId), quantity: Number(qty) })
        });
        if (res.status === 401) { setShowLogin(true); return; }
        if (!res.ok) { alert("Erreur: " + (await res.text())); return; }
        alert("Ajouté au panier ✅");
    };

    if (!p) return <div>Chargement...</div>;

    return (
        <div>
            <h1>{p.name}</h1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    {p.images?.length ? (
                        <img src={p.images[0].imageUrl} alt={p.images[0].altText || p.name} style={{ width: "100%", maxHeight: 380, objectFit: "cover" }} />
                    ) : <div style={{ background:"#f3f3f3", height: 300 }} /> }
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        {p.images?.map(img => (
                            <img key={img.id} src={img.imageUrl} alt={img.altText || p.name} style={{ width: 90, height: 90, objectFit: "cover", border:"1px solid #eee" }}/>
                        ))}
                    </div>
                </div>

                <div>
                    <p style={{ color:"#666"}}>{p.brand?.name} · {p.category?.name}</p>
                    <p>{p.description || ""}</p>

                    <div style={{ display:"flex", gap: 8, margin:"12px 0" }}>
                        <select value={variantId} onChange={e => setVariantId(e.target.value)}>
                            <option value="">Choisir la variante</option>
                            {p.variants?.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.color || "—"} · {v.size ?? "—"} · {v.price ? `${Number(v.price).toFixed(2)} €` : "—"} · stock:{v.stockQuantity}
                                </option>
                            ))}
                        </select>
                        <input type="number" min={1} max={99} value={qty} onChange={e => setQty(e.target.value)} style={{ width: 80 }} />
                        <button onClick={addToCart}>Ajouter au panier</button>
                    </div>
                </div>
            </div>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />}
        </div>
    );
}
