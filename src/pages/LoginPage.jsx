import granoImg from "../assets/GranoDuro_Pasta.png";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { user, pass, setUser, setPass, loading, error, login } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "420px 1fr", fontFamily: "system-ui" }}>
      <div style={{ background: "#f6f7fb", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ marginBottom: 18, textAlign: "center" }}>
            <div style={{ fontSize: 16, color: "#444" }}>Piattaforma per la tracciabilità della filiera</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>GRANO DURO/PASTA</div>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Accesso</div>
            <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Username"
              style={{ width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box" }} />
            <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" type="password"
              style={{ width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box" }} />
            {error && <div style={{ color: "#b00020", fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button onClick={login} disabled={loading}
              style={{ width: "100%", padding: 12, background: "#111", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Login..." : "Login"}
            </button>
          </div>
        </div>
      </div>
      <div style={{ background: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <img src={granoImg} alt="Grano duro e pasta" style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} />
      </div>
    </div>
  );
}