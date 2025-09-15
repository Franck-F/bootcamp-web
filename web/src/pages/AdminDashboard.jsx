import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("");

    const load = async () => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        const data = await api(`admin/orders?${params.toString()}`);
        setOrders(data.items);
    };

    useEffect(() => { load(); }, [status]);

    const changeStatus = async (id, st) => {
        await api(`admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: st }) });
        load();
    };

    return (
        <div>
            <h1>Admin · Commandes</h1>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="">Tous statuts</option>
                    {["pending","confirmed","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={load}>Rafraîchir</button>
            </div>

            <table width="100%" cellPadding="6" style={{ borderCollapse: "collapse" }}>
                <thead><tr><th>#</th><th>Client</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                {orders.map(o => (
                    <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
                        <td>{o.orderNumber}</td>
                        <td>{o.user?.email}</td>
                        <td>{o.totalAmount}</td>
                        <td>{o.status}</td>
                        <td style={{ display: "flex", gap: 6 }}>
                            {["confirmed","shipped","delivered","cancelled"].map(s =>
                                <button key={s} onClick={() => changeStatus(o.id, s)}>{s}</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
