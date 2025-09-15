import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onNeedLogin }) {
    const [loading, setLoading] = useState(false);
    const price = product.variants?.[0]?.price
        ? Number(product.variants[0].price)
        : (product.basePrice ? Number(product.basePrice) : undefined);

    const quickAdd = async () => {
        setLoading(true);
        try {
            // récupère le produit pour connaître les variantes
            const resP = await fetch(`/api/catalog/products/${product.id}`, { credentials: "include" });
            const full = resP.ok ? await resP.json() : product;
            const variants = full.variants || product.variants || [];
            // s'il y a une seule variante et du stock, on ajoute direct, sinon fiche produit
            const usable = variants.filter(v => v.stockQuantity > 0);
            if (usable.length === 1) {
                const v = usable[0];
                const res = await fetch("/api/cart", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productVariantId: v.id, quantity: 1 })
                });
                if (res.status === 401) { onNeedLogin?.(); return; }
                if (!res.ok) throw new Error(await res.text());
                alert("Ajouté au panier ✅");
            } else {
                // plusieurs variantes -> va sur la fiche pour choisir
                window.location.href = `/product/${product.id}`;
            }
        } catch (e) {
            console.error(e);
            alert("Impossible d'ajouter au panier.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: "1px solid #eee", borderRadius: 6, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {product.images?.[0] && (
                <img
                    src={product.images[0].imageUrl}
                    alt={product.images[0].altText || product.name}
                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 4 }}
                />
            )}
            <div style={{ fontSize: 12, color: "#777" }}>{product.brand?.name} · {product.category?.name}</div>
            <Link to={`/product/${product.id}`} style={{ textDecoration: "none", fontWeight: 600 }}>{product.name}</Link>
            <div style={{ marginTop: "auto" }}>
                {price !== undefined ? <strong>{price.toFixed(2)} €</strong> : <span>—</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <Link to={`/product/${product.id}`} className="btn">Voir</Link>
                <button onClick={quickAdd} disabled={loading}>{loading ? "..." : "Ajouter"}</button>
            </div>
        </div>
    );
}
