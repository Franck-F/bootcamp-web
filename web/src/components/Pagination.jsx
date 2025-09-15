export default function Pagination({ total, limit, offset, onChange }) {
    const pages = Math.ceil((total || 0) / (limit || 1));
    const current = Math.floor((offset || 0) / (limit || 1));
    if (pages <= 1) return null;

    const go = (i) => { if (i >= 0 && i < pages) onChange?.(i); };

    const windowPages = [];
    for (let i = Math.max(0, current - 2); i < Math.min(pages, current + 3); i++) {
        windowPages.push(i);
    }

    return (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", margin: "16px 0" }}>
            <button onClick={() => go(0)} disabled={current === 0}>«</button>
            <button onClick={() => go(current - 1)} disabled={current === 0}>‹</button>
            {windowPages.map(i => (
                <button key={i} onClick={() => go(i)} style={{ fontWeight: i === current ? 700 : 400 }}>
                    {i + 1}
                </button>
            ))}
            <button onClick={() => go(current + 1)} disabled={current >= pages - 1}>›</button>
            <button onClick={() => go(pages - 1)} disabled={current >= pages - 1}>»</button>
        </div>
    );
}
