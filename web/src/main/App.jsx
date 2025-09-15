import { Link, NavLink, Route, Routes } from "react-router-dom";
import ConsentBanner from "../modules/rgpd/ConsentBanner.jsx";
import MyData from "../modules/rgpd/pages/MyData.jsx";
import DPOContact from "../modules/rgpd/pages/DPOContact.jsx";
import Privacy from "../modules/rgpd/pages/Privacy.jsx";
import Legal from "../modules/rgpd/pages/Legal.jsx";
import Terms from "../modules/rgpd/pages/Terms.jsx";

export default function App() {
    return (
        <>
            <header style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", gap: 16 }}>
                <Link to="/">Accueil</Link>
                <NavLink to="/my-data">Mes données</NavLink>
                <NavLink to="/dpo">Contacter le DPO</NavLink>
                <NavLink to="/privacy">Confidentialité</NavLink>
                <NavLink to="/legal">Mentions légales</NavLink>
                <NavLink to="/terms">CGV/CGU</NavLink>
            </header>

            <main style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/my-data" element={<MyData />} />
                    <Route path="/dpo" element={<DPOContact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/legal" element={<Legal />} />
                    <Route path="/terms" element={<Terms />} />
                </Routes>
            </main>

            <footer style={{ padding: 16, borderTop: "1px solid #eee", display: "flex", gap: 16, justifyContent: "space-between" }}>
                <span>© 2025 Sneakers Shop</span>
                <span style={{ display: "flex", gap: 12 }}>
          <Link to="/privacy">Confidentialité</Link>
          <Link to="/legal">Mentions légales</Link>
          <Link to="/terms">CGV/CGU</Link>
          <a
              href="#"
              onClick={async (e) => {
                  e.preventDefault();
                  await fetch("/api/rgpd/consent/revoke", { method: "POST" });
                  alert("Consentement réinitialisé. Recharge la page pour revoir la bannière.");
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
            <p>Front React + Vite + RGPD : bannière cookies, “Mes données”, contact DPO.</p>
        </div>
    );
}
