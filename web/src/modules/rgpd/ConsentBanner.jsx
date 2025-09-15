import { useEffect, useState } from "react";

export default function ConsentBanner() {
    const [open, setOpen] = useState(false);
    const [prefs, setPrefs] = useState({ analytics: false, marketing: false, personalization: false, version: "v1" });

    useEffect(() => {
        (async () => {
            const r = await fetch("/api/rgpd/consent");
            const d = await r.json();
            setPrefs(d);
            const hasAny = ["analytics","marketing","personalization"].some((k) => Boolean(d[k]));
            if (!hasAny) setOpen(true);
        })();
    }, []);

    if (!open) return null;

    const save = async () => {
        await fetch("/api/rgpd/consent", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prefs)
        });
        setOpen(false);
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
            <strong>Cookies</strong> — Choix par finalité. Les essentiels ne nécessitent pas de consentement.
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

// Injecte GA seulement si consentement "analytics"
function loadGoogleAnalytics() {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", "G-XXXXXXX");
}

// Placeholder marketing
function loadMarketingPixels() { /* no-op */ }
