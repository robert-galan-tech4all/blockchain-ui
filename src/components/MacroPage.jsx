import { BTN_OCRA } from "../constants";

export default function MacroPage({ title, subtitle, onBack, onModifica, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", fontFamily: "Lato, system-ui, sans-serif", padding: "30px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0 }}>{title}</h1>
        {subtitle && <div style={{ marginTop: 8, fontSize: 18, fontWeight: 500, color: "#666" }}>{subtitle}</div>}
      </div>

      <button onClick={onBack}
        style={{ display: "block", margin: "0 auto 24px", border: "none", background: "transparent", color: "#111", fontWeight: 800, cursor: "pointer", fontSize: 16 }}>
        ← Torna alla selezione della macro-fase
      </button>

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* MODIFICA FASE - always at top */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <button type="button" onClick={onModifica}
            style={{ width: "100%", maxWidth: 640, height: 120, borderRadius: 22, border: "none", fontWeight: 800, fontSize: 38, cursor: "pointer", background: BTN_OCRA, color: "#111", boxShadow: "0 10px 25px rgba(0,0,0,0.10)" }}>
            MODIFICA FASE
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}