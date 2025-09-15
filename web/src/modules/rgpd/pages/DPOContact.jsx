import { useState } from "react";

export default function DPOContact() {
    const [busy, setBusy] = useState(false);

    return (
        <form style={{ maxWidth: 680, margin: "20px 0" }}
              onSubmit={async e => {
                  e.preventDefault(); setBusy(true);
                  const f = new FormData(e.currentTarget);
                  const r = await fetch("/api/rgpd/dpo/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: f.get("email"), subject: f.get("subject"), message: f.get("message") })
                  });
                  setBusy(false);
                  alert(r.ok ? "Message envoyé au DPO" : "Erreur");
              }}>
            <h1>Contacter le DPO</h1>
            <div style={{ display: "grid", gap: 8, maxWidth: 600 }}>
                <input name="email" type="email" placeholder="ton email" required />
                <input name="subject" placeholder="Sujet" required />
                <textarea name="message" placeholder="Message" required rows={8}/>
                <button disabled={busy} type="submit">Envoyer</button>
            </div>
        </form>
    );
}
