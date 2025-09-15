import { Link, NavLink, Route, Routes } from "react-router-dom";

// RGPD
import ConsentBanner from "../modules/rgpd/ConsentBanner.jsx";
import MyData from "../modules/rgpd/pages/MyData.jsx";
import DPOContact from "../modules/rgpd/pages/DPOContact.jsx";
import Privacy from "../modules/rgpd/pages/Privacy.jsx";
import Legal from "../modules/rgpd/pages/Legal.jsx";
import Terms from "../modules/rgpd/pages/Terms.jsx";

// Catalog / Admin
import Products from "../pages/Products.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";   // /admin/orders
import AdminProducts from "../pages/AdminProducts.jsx";     // /admin/products
import ProductDetail from "../pages/ProductDetail.jsx";

export default function App() {
    return (
        <>
            <header style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link to="/">Accueil</Link>
                <NavLink to="/products">Produits</NavLink>

                {/* Liens RGPD */}
                <NavLink to="/my-data">Mes données</NavLink>
                <NavLink to="/dpo">Contacter le DPO</NavLink>
                <NavLink to="/privacy">Confidentialité</NavLink>
                <NavLink to="/legal">Mentions légales</NavLink>
                <NavLink to="/terms">CGV/CGU</NavLink>

                {/* Admin (protégé côté backend) */}
                <NavLink to="/admin/orders">Admin : Commandes</NavLink>
                <NavLink to="/admin/products">Admin : Produits</NavLink>
            </header>

            <main style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
                <Routes>
                    <Route path="/" element={<Products />} />
                    {/* Catalog */}
                    <Route path="/products" element={<Products />} />
                    {/* Admin */}
                    <Route path="/admin/orders" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    {/* RGPD */}
                    <Route path="/my-data" element={<MyData />} />
                    <Route path="/dpo" element={<DPOContact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/legal" element={<Legal />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Routes>
            </main>

            <footer
                style={{
                    padding: 16,
                    borderTop: "1px solid #eee",
                    display: "flex",
                    gap: 16,
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}
            >
                <span>© 2025 Sneakers Shop</span>
                <span style={{ display: "flex", gap: 12 }}>
          <Link to="/privacy">Confidentialité</Link>
          <Link to="/legal">Mentions légales</Link>
          <Link to="/terms">CGV/CGU</Link>
          <a
              href="#"
              onClick={async (e) => {
                  e.preventDefault();
                  await fetch("/api/rgpd/consent/revoke", { method: "POST", credentials: "include" });
                  alert("Consentement réinitialisé. Recharge la page pour revoir la bannière.");
                  // Optionnel: window.location.reload();
              }}
          >
            Gérer mes cookies
          </a>
        </span>
            </footer>

            <ConsentBanner />
        </>
    );
}

function Home() {
    return (
        <div>
            <h1>Bienvenue 👟</h1>
            <p>Front React + Vite — Catalogue, Admin, et RGPD (bannière cookies, “Mes données”, contact DPO).</p>
        </div>
    );
}
