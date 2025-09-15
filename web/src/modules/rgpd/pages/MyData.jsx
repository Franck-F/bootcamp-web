import { useState } from "react";

export default function MyData() {
    const [busy, setBusy] = useState(false);

    const hit = async (url, opts) => {
        setBusy(true);
        const res = await fetch(url, { credentials: "include", ...(opts || {}) });
        setBusy(false);
        if (!res.ok) alert("Erreur");
        return res;
    };

    return (
        <div>
            <h1>Mes données personnelles</h1>
            <p>Exerce tes droits (accès, rectification, effacement, portabilité, limitation, opposition).</p>

            <section>
                <h2>Export (accès)</h2>
                <button disabled={busy} onClick={async () => {
                    const r = await hit("/api/rgpd/me/export");
                    const blob = new Blob([JSON.stringify(await r.json(), null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = Object.assign(document.createElement("a"), { href: url, download: "export.json" });
                    a.click(); URL.revokeObjectURL(url);
                }}>Télécharger mon export JSON</button>
            </section>

            <section>
                <h2>Portabilité</h2>
                <a href="/api/rgpd/me/portability.csv">Télécharger CSV</a>
            </section>

            <section>
                <h2>Rectification</h2>
                <form onSubmit={async e => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    await hit("/api/rgpd/me", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: form.get("email") || undefined,
                            firstName: form.get("firstName") || undefined,
                            lastName: form.get("lastName") || undefined
                        })
                    });
                    alert("Infos mises à jour.");
                }}>
                    <div style={{ display: "grid", gap: 8, maxWidth: 400 }}>
                        <input name="email" placeholder="nouvel email" />
                        <input name="firstName" placeholder="prénom" />
                        <input name="lastName" placeholder="nom" />
                        <button type="submit" disabled={busy}>Mettre à jour</button>
                    </div>
                </form>
            </section>

            <section>
                <h2>Opposition marketing</h2>
                <button disabled={busy} onClick={() => hit("/api/rgpd/me/opt-out-marketing", { method: "POST" })}>
                    Me désinscrire des communications marketing
                </button>
            </section>

            <section>
                <h2>Limitation du traitement</h2>
                <button disabled={busy} onClick={() => hit("/api/rgpd/me/restrict", { method: "POST" })}>
                    Demander la limitation
                </button>
            </section>

            <section>
                <h2>Suppression du compte</h2>
                <button style={{ color: "white", background: "crimson" }}
                        disabled={busy}
                        onClick={async () => {
                            if (confirm("Supprimer définitivement ton compte ?")) {
                                await hit("/api/rgpd/me", { method: "DELETE" });
                                window.location.href = "/";
                            }
                        }}>
                    Supprimer mon compte
                </button>
            </section>
        </div>
    );
}
