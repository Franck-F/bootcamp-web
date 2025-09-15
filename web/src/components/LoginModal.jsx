import { useState } from "react";

export default function LoginModal({ onClose, onSuccess }) {
    const [mode, setMode] = useState("login"); // login|register
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true); setErr("");
        try {
            const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
            const payload = mode === "login"
                ? { email, password }
                : { email, password, firstName, lastName };
            const res = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const txt = await res.text();
                setErr(txt || "Erreur");
                return;
            }
            onSuccess?.();
            onClose?.();
        } catch (e) {
            setErr(String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
            display: "grid", placeItems: "center", zIndex: 1000
        }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: 16, width: 360, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>{mode === "login" ? "Se connecter" : "Créer un compte"}</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <form onSubmit={submit} style={{ display: "grid", gap: 8, marginTop: 12 }}>
                    {mode === "register" && (
                        <>
                            <input placeholder="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            <input placeholder="Nom" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </>
                    )}
                    <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Mot de passe" required value={password} onChange={e => setPassword(e.target.value)} />
                    {err && <div style={{ color: "crimson", fontSize: 12 }}>{err}</div>}
                    <button type="submit" disabled={loading}>{loading ? "..." : (mode === "login" ? "Connexion" : "Créer mon compte")}</button>
                </form>

                <div style={{ marginTop: 8, fontSize: 12 }}>
                    {mode === "login" ? (
                        <button onClick={() => setMode("register")}>Pas de compte ? S’inscrire</button>
                    ) : (
                        <button onClick={() => setMode("login")}>Déjà inscrit ? Se connecter</button>
                    )}
                </div>
            </div>
        </div>
    );
}
