export async function api(path, opts = {}) {
    const res = await fetch(path.startsWith("/") ? path : `/api/${path}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        ...opts,
    });
    if (!res.ok) {
        let msg = "Erreur";
        try { const j = await res.json(); msg = j?.error || msg; } catch {}
        throw new Error(`${res.status}: ${msg}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
}
