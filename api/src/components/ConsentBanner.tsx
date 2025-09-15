// web/src/components/ConsentBanner.tsx
import { useEffect, useState } from "react";

type Prefs = { analytics: boolean; marketing: boolean; personalization: boolean; version: string };

export default function ConsentBanner() {
    const [open, setOpen] = useState(false);
    const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false, personalization: false, version: "v1" });

    useEffect(() => {
        // Vérifie si déjà consenti
        fetch("/api/rgpd/consent").then(r => r.json()).then(setPrefs).then(() => {
            // Ouvre la bannière seulement si aucune préférence n'est posée (toutes false ET pas de cookie)
            // Simple heuristique: si aucune clé true ET pas de cookie local mark, on affiche
            const hasAny = ["analytics","marketing","personalization"].some(k => (prefs as any)[k]);
            if (!hasAny) setOpen(true);
        });
        // eslint-disable-next-line
    }, []);

    if (!open) return null;

    const save = async () => {
        await fetch("/api/rgpd/consent", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(prefs) });
        setOpen(false);
        // Charge dynamiquement les scripts si consentement donné
        if (prefs.analytics) loadGoogleAnalytics();
        if (prefs.marketing) loadMarketingPixels();
    };

    const refuseAll = async () => {
        const off = { analytics: false, marketing: false, personalization: false, version: "v1" };
        await fetch("/api/rgpd/consent", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(off) });
        setOpen(false);
    };

    return (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: 16, background: "#111", color: "#fff", zIndex: 9999 }}>
            <strong>Cookies</strong> — Choisis par finalité (13 mois max). Les essentiels ne nécessitent pas de consentement.
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                <label><input type="checkbox" checked={prefs.analytics} onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))}/> Analytique</label>
                <label><input type="checkbox" checked={prefs.marketing} onChange={e => setPrefs(p => ({ ...p, marketing: e.target.checked }))}/> Marketing</label>
                <label><input type="checkbox" checked={prefs.personalization} onChange={e => setPrefs(p => ({ ...p, personalization: e.target.checked }))}/> Personnalisation</label>
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button onClick={save}>Enregistrer</button>
                <button onClick={refuseAll}>Tout refuser</button>
                <a href="/privacy" style={{ color: "#8cf" }}>Politique de confidentialité</a>
            </div>
        </div>
    );
}

function loadGoogleAnalytics() {
    // Exemple : injecte GA4 UNIQUEMENT après consentement Analytics
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
    document.head.appendChild(s);
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(){(window as any).dataLayer.push(arguments);}
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", "G-XXXXXXX");
}

function loadMarketingPixels() {
    // Exemple placeholder pour Meta Pixel, etc. — à injecter seulement si consentement marketing
}
