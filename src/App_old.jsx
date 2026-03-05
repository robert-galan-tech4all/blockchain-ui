import { useState } from "react";
import axios from "axios";
import granoImg from "./assets/GranoDuro_Pasta.png";

const API_BASE = "/unife";
const TEST_ENDPOINT = "/lotti";
const LS_USER = "t4a_unife_user"; // DA ELIMINARE!
const LS_PASS = "t4a_unife_pass"; // DA ELIMINARE!

/* ==========================
   PAGINA 2 (dopo login)
========================== */
function LandingFasi({ onGo, onInsertLotto, onModifyLotto, onOpenDeleteLotto, onOpenRecuperaLotto }) {
  const BTN_COLOR = "#F5CF71";
  const BTN_OCRA = "#C9A227";
  const BTN_OCRA_DARK = "#A67C00";

  const smallBtn = (bg) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: 16,
    border: "none",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    background: bg,
    color: "white",
    boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
  });

  const bigBtn = (bg) => ({
    width: "100%",
    padding: "18px 16px",
    borderRadius: 22,
    border: "none",
    fontWeight: 800,
    fontSize: 45,
    cursor: "pointer",
    background: bg,
    color: "#111",
    boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
    height: 150,
  });

  const bigBtnStyle = {
    width: "100%",
    fontWeight: 800,
    padding: "36px 28px",
    borderRadius: 22,
    border: "none",
    background: BTN_COLOR,
    color: "#000",
    fontFamily: "Lato, system-ui, sans-serif",
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 14px 35px rgba(0,0,0,0.15)",
  };

  const titleStyle = { fontSize: 42, fontWeight: 700, marginBottom: 6, textAlign: "center" };
  const subtitleStyle = { fontSize: 18, fontWeight: 500, opacity: 0.85 };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px",
        fontFamily: "Lato, system-ui, sans-serif",
      }}
    >
      {/* TITOLO */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 60, fontWeight: 1000, margin: 0, lineHeight: 1.15 }}>
          BLOCKCHAIN FILIERA
          <br />
          GRANO DURO/PASTA
        </h1>

        <div style={{ marginTop: 12, fontSize: 22, color: "#555", maxWidth: 900 }}>
          Sistema digitale per la registrazione, consultazione e verifica
          <br />
          della merce tracciata e delle diverse fasi della filiera agroalimentare
        </div>
      </div>

      {/* BOTTONI LOTTO */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 48 }}>
          <button type="button" style={{ ...bigBtn(BTN_OCRA), width: 640 }} onClick={onInsertLotto}>
            INSERISCI LOTTO
          </button>

          <button type="button" style={{ ...bigBtn(BTN_OCRA), width: 640 }} onClick={onModifyLotto}>
            MODIFICA LOTTO
          </button>
        </div>
      </div>

      {/* BOTTONI FASI */}
      <div style={{ width: "100%", maxWidth: 900, display: "grid", gap: 28 }}>
        <button style={bigBtnStyle} onClick={() => onGo("presemina")}>
          <div style={titleStyle}>PRESEMINA E SEMINA</div>
          <div style={subtitleStyle}>XXX senti Blasi per descrizione di questa parte</div>
        </button>

        <button style={bigBtnStyle} onClick={() => onGo("raccolta")}>
          <div style={titleStyle}>RACCOLTA E CONSEGNA AL SILOS</div>
          <div style={subtitleStyle}>XXX senti Blasi per descrizione di questa parte</div>
        </button>

        <button style={bigBtnStyle} onClick={() => onGo("stoccaggio")}>
          <div style={titleStyle}>STOCCAGGIO E CONSEGNA A SEMOLIERE</div>
          <div style={subtitleStyle}>XXX senti Blasi per descrizione di questa parte</div>
        </button>
      </div>

      {/* RECUPERA INFO LOTTO */}
      <div style={{ width: "100%", maxWidth: 900, marginTop: 32 }}>
        <button
          type="button"
          style={{ ...smallBtn(BTN_OCRA_DARK), height: 70, width: "100%", fontSize: 28 }}
          onClick={onOpenRecuperaLotto}
        >
          Recupera Info Lotto
        </button>
      </div>

      {/* ELIMINA LOTTO */}
      <div style={{ width: "100%", maxWidth: 900, marginTop: 25, display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          style={{
            height: 100,
            width: "75%",
            borderRadius: 16,
            border: "none",
            fontWeight: 800,
            fontSize: 34,
            cursor: "pointer",
            background: "linear-gradient(135deg, #A67C00 0%, #B03A2E 100%)",
            color: "white",
            boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
          }}
          onClick={onOpenDeleteLotto}
        >
          ELIMINA LOTTO
        </button>
      </div>
    </div>
  );
}

/* ==========================
   APP
========================== */
export default function App() {
  /* ========== STATE LOGIN ========== */
  const [user, setUser] = useState(localStorage.getItem(LS_USER) || ""); // DA ELIMINARE!
  const [pass, setPass] = useState(localStorage.getItem(LS_PASS) || ""); // DA ELIMINARE!
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isAuthed, setIsAuthed] = useState(false);
  const [page, setPage] = useState("landing"); // landing | presemina | raccolta | stoccaggio

  /* ========== LOTTO: CREA / MODIFICA ========== */
  const [showCreateLotto, setShowCreateLotto] = useState(false);
  const [lottoMode, setLottoMode] = useState("create"); // create | edit
  const [createLottoIdRaw, setCreateLottoIdRaw] = useState("");
  const [editFullLottoId, setEditFullLottoId] = useState("");
  const [createLottoCreator, setCreateLottoCreator] = useState("");
  const [createLottoLoading, setCreateLottoLoading] = useState(false);
  const [createLottoMsg, setCreateLottoMsg] = useState("");
  const [createLottoValidationMsg, setCreateLottoValidationMsg] = useState("");

  /* ========== LOTTO: CHIEDI ID PER MODIFICA ========== */
  const [showEditAskId, setShowEditAskId] = useState(false);
  const [editAskIdRaw, setEditAskIdRaw] = useState("");
  const [editAskIdMsg, setEditAskIdMsg] = useState("");
  const [editAskIdLoading, setEditAskIdLoading] = useState(false);
  const [editAskIdValidationMsg, setEditAskIdValidationMsg] = useState("");

  /* ========== LOTTO: RECUPERA INFO ========== */
  const [showRecuperaAskId, setShowRecuperaAskId] = useState(false);
  const [recuperaAskIdRaw, setRecuperaAskIdRaw] = useState("");
  const [recuperaAskIdMsg, setRecuperaAskIdMsg] = useState("");
  const [recuperaAskIdLoading, setRecuperaAskIdLoading] = useState(false);
  const [recuperaAskIdValidationMsg, setRecuperaAskIdValidationMsg] = useState("");
  const [showRecuperaViewer, setShowRecuperaViewer] = useState(false);
  const [recuperaViewerData, setRecuperaViewerData] = useState(null);

  /* ========== LOTTO: ELIMINA ========== */
  const [showDeleteLotto, setShowDeleteLotto] = useState(false);
  const [deleteLottoId, setDeleteLottoId] = useState("");
  const [deleteLottoMsg, setDeleteLottoMsg] = useState("");
  const [deleteLottoLoading, setDeleteLottoLoading] = useState(false);
  const [deleteLottoValidationMsg, setDeleteLottoValidationMsg] = useState("");

  // ===== MODIFICA FASE: ask lotto id =====
  const [showModifyFaseAskLottoId, setShowModifyFaseAskLottoId] = useState(false);
  const [modifyFaseAskLottoIdRaw, setModifyFaseAskLottoIdRaw] = useState("");
  const [modifyFaseAskLottoIdValidationMsg, setModifyFaseAskLottoIdValidationMsg] = useState("");
  const [modifyFaseTargetLottoId, setModifyFaseTargetLottoId] = useState(""); // es. GD-123

  // ===== MODIFICA FASE: finestra successiva  =====
  const [showModifyFaseModal, setShowModifyFaseModal] = useState(false);

  const [modifyFaseSelected, setModifyFaseSelected] = useState(""); // "APPEZZAMENTO" | "LAVORAZIONI" | ...

  /* ========== FASE: ELIMINA ========== */
  const [showDeleteFaseAsk, setShowDeleteFaseAsk] = useState(false);
  const [delFaseLottoIdRaw, setDelFaseLottoIdRaw] = useState("");
  const [delFaseNome, setDelFaseNome] = useState("");
  const [delFaseAskMsg, setDelFaseAskMsg] = useState("");
  const [delFaseAskLoading, setDelFaseAskLoading] = useState(false);
  const [delFaseAskValidationMsg, setDelFaseAskValidationMsg] = useState("");
    // Elimina Fase - radio presemina
  const [delFaseTipo, setDelFaseTipo] = useState("");
  const [delFaseSuffix, setDelFaseSuffix] = useState("");



  /* ========== PRESEMINA/SEMINA: APPEZZAMENTO ========== */
  const APPEZZ_PREFIX = "presemina_appezzamento-";
  const [showAppezzamento, setShowAppezzamento] = useState(false);
  const [appNomeRaw, setAppNomeRaw] = useState("");
  const [appOperatore, setAppOperatore] = useState("");
  const [appCodice, setAppCodice] = useState("");
  const [appComune, setAppComune] = useState("");
  const [appProvincia, setAppProvincia] = useState("");
  const [appSuperficie, setAppSuperficie] = useState("");
  const [appLat, setAppLat] = useState("");
  const [appLon, setAppLon] = useState("");
  const [appValidationMsg, setAppValidationMsg] = useState("");
  const [appJsonPreview, setAppJsonPreview] = useState(null);
  const [appSubmitLoading, setAppSubmitLoading] = useState(false);
  const [appSubmitMsg, setAppSubmitMsg] = useState("");

  // MODALE PRE-APPEZZAMENTO: chiedi ID lotto
  const [showAppezzAskLottoId, setShowAppezzAskLottoId] = useState(false);
  const [appezzAskLottoIdRaw, setAppezzAskLottoIdRaw] = useState("");
  const [appezzAskLottoIdValidationMsg, setAppezzAskLottoIdValidationMsg] = useState("");
  const [appezzTargetLottoId, setAppezzTargetLottoId] = useState(""); // es. GD-123

  /* ========== PRESEMINA - RECUPERA INFO FASE ========== */
const [showRecuperaFaseAsk, setShowRecuperaFaseAsk] = useState(false);
const [recFaseLottoIdRaw, setRecFaseLottoIdRaw] = useState("");
const [recFaseNome, setRecFaseNome] = useState("");
const [recFaseAskMsg, setRecFaseAskMsg] = useState("");
const [recFaseAskLoading, setRecFaseAskLoading] = useState(false);
const [recFaseAskValidationMsg, setRecFaseAskValidationMsg] = useState("");
const [showRecuperaFaseViewer, setShowRecuperaFaseViewer] = useState(false);
const [recuperaFaseViewerData, setRecuperaFaseViewerData] = useState(null);
// Recupera info Fase - radio
const [recFaseTipo, setRecFaseTipo] = useState("");        // uno tra 4
const [recFaseSuffix, setRecFaseSuffix] = useState("");    // ciò che inserisce l'utente (id fase)



const PRESEMINA_FASE_PREFIX = {
  APPEZZAMENTO: "presemina_appezzamento-",
  LAVORAZIONI: "presemina_lavorazioni-",
  "ACQUISIZIONE VARIETÀ": "presemina_acquisizionevarieta-",
  SEMINA: "presemina_semina-",
};

function buildPreseminaFaseNome(tipo, suffix) {
  const pref = PRESEMINA_FASE_PREFIX[tipo] || "";
  return `${pref}${String(suffix || "").trim()}`;
}

  /* ========== UTILS ========== */
  function buildLottoId(raw) {
    const cleaned = String(raw || "").trim();
    const noPrefix = cleaned.replace(/^GD-?/i, "").replace(/^-/, "");
    return `GD-${noPrefix}`;
  }

  function formatISOWithLocalOffset(d) {
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    const off = -d.getTimezoneOffset();
    const sign = off >= 0 ? "+" : "-";
    const offAbs = Math.abs(off);
    const offH = pad(Math.floor(offAbs / 60));
    const offM = pad(offAbs % 60);
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}${sign}${offH}:${offM}`;
  }

  function valueToText(v) {
    if (v === null || v === undefined) return "—";
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
    return JSON.stringify(v);
  }

  /* ========== API CALLS ========== */
  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}${TEST_ENDPOINT}`, {
        auth: { username: user.trim(), password: pass },
        headers: { "Content-Type": "application/json" },
      });

      if (res?.data?.status && res.data.status !== "OK") {
        throw new Error(res.data.message || "Login fallito");
      }

      localStorage.setItem(LS_USER, user.trim()); // DA ELIMINARE!
      localStorage.setItem(LS_PASS, pass); // DA ELIMINARE!

      setIsAuthed(true);
      setPage("landing");
    } catch (e) {
      setError(e?.response?.status === 401 ? "Credenziali non valide" : "Errore di rete o server");
    } finally {
      setLoading(false);
    }
  }

  /* ========== LOTTO: MODALI ========== */
  function openCreateLottoModal() {
    setLottoMode("create");
    setEditFullLottoId("");
    setCreateLottoIdRaw("");
    setCreateLottoCreator("");
    setCreateLottoMsg("");
    setCreateLottoValidationMsg("");
    setShowCreateLotto(true);
  }

  function openAskEditLottoIdModal() {
    setEditAskIdRaw("");
    setEditAskIdMsg("");
    setEditAskIdValidationMsg("");
    setShowEditAskId(true);
  }

  function openRecuperaLottoAskIdModal() {
    setRecuperaAskIdRaw("");
    setRecuperaAskIdMsg("");
    setRecuperaAskIdValidationMsg("");
    setShowRecuperaAskId(true);
  }

  /* ========== APPEZZAMENTO: MODALE PRE (ID LOTTO) ========== */
  function openAppezzamentoAskLottoIdModal() {
    setAppezzAskLottoIdRaw("");
    setAppezzAskLottoIdValidationMsg("");
    setShowAppezzAskLottoId(true);
  }

  function openModifyFaseAskLottoIdModal() {
  setModifyFaseAskLottoIdRaw("");
  setModifyFaseAskLottoIdValidationMsg("");
  setShowModifyFaseAskLottoId(true);
}

function openRecuperaFaseAskModal() {
  setRecFaseLottoIdRaw("");
  setRecFaseTipo("");
  setRecFaseSuffix("");
  setRecFaseNome("");
  setRecFaseAskMsg("");
  setRecFaseAskValidationMsg("");
  setShowRecuperaFaseAsk(true);
}

async function handleRecuperaFaseAskOk() {
 const rawLotto = recFaseLottoIdRaw.trim();
  const tipo = recFaseTipo;
  const suffix = recFaseSuffix.trim();

  if (!rawLotto || !tipo || !suffix) {
    setRecFaseAskValidationMsg("Compilare tutti i campi richiesti");
    return;
  }

const faseName = buildPreseminaFaseNome(tipo, suffix);


  const fullLottoId = buildLottoId(rawLotto);

  setRecFaseAskLoading(true);
  try {
    // endpoint più probabile: /lotti/{id}/fasi/{fase}
    const url = `${API_BASE}/lotti/${encodeURIComponent(fullLottoId)}/fasi/${encodeURIComponent(faseName)}`;

    const res = await axios.get(url, {
      auth: { username: user.trim(), password: pass },
      headers: { "Content-Type": "application/json" },
    });

    const root = res?.data;

    // normalizziamo: vogliamo sempre { nome, dettagli }
    const faseObj =
      root?.dettagli ? root :
      root?.data?.dettagli ? root.data :
      root?.fase?.dettagli ? root.fase :
      root?.result?.dettagli ? root.result :
      root?.payload?.dettagli ? root.payload :
      root;

    const nomeFromServer = String(faseObj?.nome || faseObj?.name || faseName);
    const dettagli = (faseObj && typeof faseObj === "object" && faseObj.dettagli && typeof faseObj.dettagli === "object")
      ? faseObj.dettagli
      : {};

    const normalized = {
      nome: nomeFromServer,
      dettagli,
      __ui_title: `Fase: ${nomeFromServer}`,
      __ui_lotto: fullLottoId,
    };

    setRecuperaFaseViewerData(normalized);
    setShowRecuperaFaseAsk(false);
    setShowRecuperaFaseViewer(true);
  } catch (e) {
    const msg =
      e?.response?.status === 401
        ? "401: Credenziali non valide"
        : e?.response?.status === 404
        ? "Fase non trovata (o lotto non trovato)"
        : e?.response?.data?.message
        ? String(e.response.data.message)
        : e?.message || "Errore di rete o server";
    setRecFaseAskMsg(msg);
  } finally {
    setRecFaseAskLoading(false);
  }
}

function openDeleteFaseAskModal() {
  setDelFaseLottoIdRaw("");
  setDelFaseTipo("");
  setDelFaseSuffix("");
  setDelFaseNome("");
  setDelFaseAskMsg("");
  setDelFaseAskValidationMsg("");
  setShowDeleteFaseAsk(true);
}


async function handleDeleteFaseAskOk() {
  const rawLotto = delFaseLottoIdRaw.trim();
const tipo = delFaseTipo;
const suffix = delFaseSuffix.trim();

if (!rawLotto || !tipo || !suffix) {
  setDelFaseAskValidationMsg("Compilare tutti i campi richiesti");
  return;
}

const faseName = buildPreseminaFaseNome(tipo, suffix);

  setDelFaseAskValidationMsg("");
  setDelFaseAskMsg("");

  const fullLottoId = buildLottoId(rawLotto);

  setDelFaseAskLoading(true);
  try {
    const url = `${API_BASE}/lotti/${encodeURIComponent(fullLottoId)}/fasi/${encodeURIComponent(faseName)}`;

    const res = await axios.delete(url, {
      auth: { username: user.trim(), password: pass },
      headers: { "Content-Type": "application/json" },
    });

    const status = res?.data?.status;
    const message = res?.data?.message ?? "Operazione completata";

    setDelFaseAskMsg(status ? `${status}: ${message}` : message);

    // opzionale: chiudi modale dopo successo (se vuoi)
    // setShowDeleteFaseAsk(false);
  } catch (e) {
    const msg =
      e?.response?.status === 401
        ? "401: Credenziali non valide"
        : e?.response?.status === 404
        ? "Fase non trovata (o lotto non trovato)"
        : e?.response?.data?.message
        ? String(e.response.data.message)
        : e?.message || "Errore di rete o server";
    setDelFaseAskMsg(msg);
  } finally {
    setDelFaseAskLoading(false);
  }
}


  function handleAppezzAskLottoIdOk() {
    const raw = appezzAskLottoIdRaw.trim();
    if (!raw) {
      setAppezzAskLottoIdValidationMsg("Compilare tutti i campi richiesti");
      return;
    }

    const fullId = buildLottoId(raw);
    setAppezzTargetLottoId(fullId);

    setShowAppezzAskLottoId(false);
    openAppezzamentoModal();
  }

  async function handleEditAskIdOk() {
    const raw = editAskIdRaw.trim();
    if (!raw) {
      setEditAskIdValidationMsg("Compilare tutti i campi richiesti");
      return;
    }
    setEditAskIdValidationMsg("");

    const fullId = buildLottoId(raw);
    setEditAskIdLoading(true);
    setEditAskIdMsg("");

    try {
      const res = await axios.get(`${API_BASE}/lotti/${encodeURIComponent(fullId)}`, {
        auth: { username: user.trim(), password: pass },
        headers: { "Content-Type": "application/json" },
      });

      const dg = res?.data?.dati_generali || {};
      const lottoFromServer = String(dg.lotto || fullId);
      const creatorFromServer = String(dg.operatore_creazione || "");

      const suffix = lottoFromServer.replace(/^GD-?/i, "");

      setLottoMode("edit");
      setEditFullLottoId(buildLottoId(lottoFromServer));
      setCreateLottoIdRaw(suffix);
      setCreateLottoCreator(creatorFromServer);

      setCreateLottoMsg("");
      setCreateLottoValidationMsg("");

      setShowEditAskId(false);
      setShowCreateLotto(true);
    } catch (e) {
      const msg =
        e?.response?.status === 401
          ? "401: Credenziali non valide"
          : e?.response?.status === 404
          ? "Lotto non trovato"
          : e?.message || "Errore di rete o server";
      setEditAskIdMsg(msg);
    } finally {
      setEditAskIdLoading(false);
    }
  }

  async function handleRecuperaAskIdOk() {
    const raw = recuperaAskIdRaw.trim();
    if (!raw) {
      setRecuperaAskIdValidationMsg("Compilare tutti i campi richiesti");
      return;
    }
    setRecuperaAskIdValidationMsg("");

    const fullId = buildLottoId(raw);
    setRecuperaAskIdLoading(true);
    setRecuperaAskIdMsg("");

    try {
      const res = await axios.get(`${API_BASE}/lotti/${encodeURIComponent(fullId)}`, {
        auth: { username: user.trim(), password: pass },
        headers: { "Content-Type": "application/json" },
      });

      const root = res?.data;

      const lottoObj =
        root?.dati_generali
          ? root
          : root?.data?.dati_generali
          ? root.data
          : root?.lotto?.dati_generali
          ? root.lotto
          : root?.result?.dati_generali
          ? root.result
          : root?.payload?.dati_generali
          ? root.payload
          : root?.item?.dati_generali
          ? root.item
          : root;

      const dg = lottoObj?.dati_generali || {};
      const lottoFromServer = String(dg.lotto || lottoObj?.lotto_id || lottoObj?.id || fullId);

      const normalized = {
        ...lottoObj,
        dati_generali: dg,
        fasi: Array.isArray(lottoObj?.fasi) ? lottoObj.fasi : [],
        __ui_title: buildLottoId(lottoFromServer),
      };

      setRecuperaViewerData(normalized);
      setShowRecuperaAskId(false);
      setShowRecuperaViewer(true);
    } catch (e) {
      const msg =
        e?.response?.status === 401
          ? "401: Credenziali non valide"
          : e?.response?.status === 404
          ? "Lotto non trovato"
          : e?.message || "Errore di rete o server";
      setRecuperaAskIdMsg(msg);
    } finally {
      setRecuperaAskIdLoading(false);
    }
  }

  function handleModifyFaseAskLottoIdOk() {
  const raw = modifyFaseAskLottoIdRaw.trim();
  if (!raw) {
    setModifyFaseAskLottoIdValidationMsg("Compilare tutti i campi richiesti");
    return;
  }

  const fullId = buildLottoId(raw);
  setModifyFaseTargetLottoId(fullId);

  // reset selezione fase
  setModifyFaseSelected("");

  setShowModifyFaseAskLottoId(false);

  // ora apriamo la finestra con le 4 fasi (radio)
  setShowModifyFaseModal(true);
}

  async function handleCreateOrUpdateLotto() {
    const creator = createLottoCreator.trim();

    if (!creator) {
      setCreateLottoValidationMsg("Compilare tutti i campi richiesti");
      return;
    }

    if (lottoMode !== "edit") {
      const raw = createLottoIdRaw.trim();
      if (!raw) {
        setCreateLottoValidationMsg("Compilare tutti i campi richiesti");
        return;
      }
    }
    setCreateLottoValidationMsg("");

    const now = new Date();
    const fullId = lottoMode === "edit" ? buildLottoId(editFullLottoId) : buildLottoId(createLottoIdRaw);

    const payload = {
      dati_generali: {
        lotto: fullId,
        filiera: "Grano duro/Pasta",
        operatore_creazione: creator,
        timestamp_creazione: formatISOWithLocalOffset(now),
      },
    };

    setCreateLottoLoading(true);
    setCreateLottoMsg("");

    try {
      if (lottoMode === "edit") {
        await axios.put(`${API_BASE}/lotti/${encodeURIComponent(fullId)}`, payload, {
          auth: { username: user.trim(), password: pass },
          headers: { "Content-Type": "application/json" },
        });
        setCreateLottoMsg("OK: Lotto modificato correttamente");
      } else {
        await axios.post(`${API_BASE}/lotti`, payload, {
          auth: { username: user.trim(), password: pass },
          headers: { "Content-Type": "application/json" },
        });
        setCreateLottoMsg("OK: Lotto inserito correttamente");
      }
    } catch (e) {
      const msg =
        e?.response?.status === 401
          ? "401: Credenziali non valide"
          : e?.response?.data?.message
          ? String(e.response.data.message)
          : e?.message || "Errore di rete o server";
      setCreateLottoMsg(msg);
    } finally {
      setCreateLottoLoading(false);
    }
  }

  async function handleDeleteLotto() {
    const raw = deleteLottoId.trim();
    if (!raw) {
      setDeleteLottoValidationMsg("Compilare tutti i campi richiesti");
      return;
    }
    setDeleteLottoValidationMsg("");

    const fullId = buildLottoId(raw);

    setDeleteLottoLoading(true);
    setDeleteLottoMsg("");

    try {
      const res = await axios.delete(`${API_BASE}/lotti/${encodeURIComponent(fullId)}`, {
        auth: { username: user.trim(), password: pass },
        headers: { "Content-Type": "application/json" },
      });

      const status = res?.data?.status;
      const message = res?.data?.message ?? "Operazione completata";
      setDeleteLottoMsg(status ? `${status}: ${message}` : message);
    } catch (e) {
      const msg =
        e?.response?.status === 401
          ? "401: Credenziali non valide"
          : e?.response?.status === 404
          ? "Lotto non trovato"
          : e?.message || "Errore di rete o server";
      setDeleteLottoMsg(msg);
    } finally {
      setDeleteLottoLoading(false);
    }
  }


  /* ==========================
     APPEZZAMENTO
  ========================== */
  function openAppezzamentoModal() {
    setAppNomeRaw("");
    setAppOperatore("");
    setAppCodice("");
    setAppComune("");
    setAppProvincia("");
    setAppSuperficie("");
    setAppLat("");
    setAppLon("");
    setAppValidationMsg("");
    setAppJsonPreview(null);
    setAppSubmitLoading(false);
    setAppSubmitMsg("");
    setShowAppezzamento(true);
  }

  function buildAppezzamentoPayload() {
    const suffix = String(appNomeRaw || "").trim();
    const nome = `${APPEZZ_PREFIX}${suffix}`;

    return {
      nome,
      dettagli: {
        timestamp_fase: formatISOWithLocalOffset(new Date()),
        operatore: String(appOperatore || "").trim(),

        codice_appezzamento: String(appCodice || "").trim(),
        comune: String(appComune || "").trim(),
        provincia: String(appProvincia || "").trim(),
        superficie_ha: String(appSuperficie || "").trim(),
        gps_lat: String(appLat || "").trim(),
        gps_lon: String(appLon || "").trim(),
      },
    };
  }

  async function handleSubmitAppezzamento() {
    // validazioni campi finestra
    if (
      !appNomeRaw.trim() ||
      !appOperatore.trim() ||
      !appCodice.trim() ||
      !appComune.trim() ||
      !appProvincia.trim() ||
      !appSuperficie.trim() ||
      !appLat.trim() ||
      !appLon.trim()
    ) {
      setAppValidationMsg("Compilare tutti i campi richiesti");
      return;
    }

    // validazione lotto scelto nella finestra precedente
    if (!appezzTargetLottoId) {
      setAppValidationMsg("ID lotto mancante. Riapri APPEZZAMENTO e inserisci l'ID lotto.");
      return;
    }

    setAppValidationMsg("");
    setAppSubmitMsg("");

    const fullLottoId = appezzTargetLottoId;

    // payload richiesto dallo swagger: { nome, dettagli }
    const payload = buildAppezzamentoPayload();

    // continuiamo a mostrare anche il JSON
    setAppJsonPreview(payload);

    setAppSubmitLoading(true);
    try {
      await axios.post(`${API_BASE}/lotti/${encodeURIComponent(fullLottoId)}/fasi`, payload, {
        auth: { username: user.trim(), password: pass },
        headers: { "Content-Type": "application/json" },
      });

      setAppSubmitMsg(`OK: fase aggiunta al lotto ${fullLottoId}`);
    } catch (e) {
      const msg =
        e?.response?.status === 401
          ? "401: Credenziali non valide"
          : e?.response?.status === 404
          ? "Lotto non trovato"
          : e?.response?.data?.message
          ? String(e.response.data.message)
          : e?.message || "Errore di rete o server";
      setAppSubmitMsg(msg);
    } finally {
      setAppSubmitLoading(false);
    }
  }

  function handleModifyFase() {
    openModifyFaseAskLottoIdModal();
  }
  function handleRecuperaFase() {
    openRecuperaFaseAskModal();
  }

 function handleEliminaFase() {
    openDeleteFaseAskModal();
  }


  /* ==========================
     PAGINE MACROFASI
  ========================== */
  function MacroPage({ title, onBack, children }) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f6f7fb",
          fontFamily: "Lato, system-ui, sans-serif",
          padding: "30px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0 }}>{title}</h1>

          {title === "PRESEMINA E SEMINA" && (
            <div style={{ marginTop: 10, fontSize: 20, fontWeight: 500, color: "#555" }}>
              Senti Blasi per descrizione sottotitolo
            </div>
          )}

          {title === "RACCOLTA E CONSEGNA AL SILOS" && (
            <div style={{ marginTop: 10, fontSize: 20, fontWeight: 500, color: "#555" }}>
              Senti Blasi per descrizione sottotitolo
            </div>
          )}

          {title === "STOCCAGGIO E CONSEGNA A SEMOLIERE" && (
            <div style={{ marginTop: 10, fontSize: 20, fontWeight: 500, color: "#555" }}>
              Senti Blasi per descrizione sottotitolo
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          style={{
            display: "block",
            margin: "10px auto 24px",
            border: "none",
            background: "transparent",
            color: "#111",
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "Lato, system-ui, sans-serif",
            fontSize: 16,
          }}
        >
          ← Torna alla selezione della macro-fase
        </button>

        <div style={{ maxWidth: 1000, margin: "0 auto" }}>{children}</div>
      </div>
    );
  }

  /* ==========================
     POST-LOGIN RENDER
  ========================== */
  if (isAuthed) {
    return (
      <>
        {/* fallback anti-schermo-bianco */}
        {page !== "landing" && page !== "presemina" && page !== "raccolta" && page !== "stoccaggio" && (
          <div style={{ padding: 20, fontFamily: "system-ui" }}>
            Pagina non valida: {String(page)}{" "}
            <button onClick={() => setPage("landing")} style={{ marginLeft: 8 }}>
              Torna alla home
            </button>
          </div>
        )}

        {page === "landing" && (
          <LandingFasi
            onGo={setPage}
            onInsertLotto={openCreateLottoModal}
            onModifyLotto={openAskEditLottoIdModal}
            onOpenRecuperaLotto={openRecuperaLottoAskIdModal}
            onOpenDeleteLotto={() => {
              setDeleteLottoId("");
              setDeleteLottoMsg("");
              setDeleteLottoValidationMsg("");
              setShowDeleteLotto(true);
            }}
          />
        )}

        {page === "presemina" && (
          <MacroPage title="PRESEMINA E SEMINA" onBack={() => setPage("landing")}>
            {/* MODIFICA FASE (in alto) */}
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <button
                type="button"
                onClick={handleModifyFase}
                style={{
                  width: "100%",
                  maxWidth: 640,
                  padding: "18px 16px",
                  borderRadius: 22,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 45,
                  cursor: "pointer",
                  background: "#C9A227",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                  height: 150,
                }}
              >
                MODIFICA FASE
              </button>
            </div>

            {/* 4 fasi */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <button
                onClick={openAppezzamentoAskLottoIdModal}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                APPEZZAMENTO
              </button>

              <button
                onClick={() => console.log("LAVORAZIONI")}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                LAVORAZIONI
              </button>

              <button
                onClick={() => console.log("ACQUISIZIONE VARIETÀ")}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                ACQUISIZIONE VARIETÀ
              </button>

              <button
                onClick={() => console.log("SEMINA")}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                SEMINA
              </button>
            </div>

            {/* BOTTONI FASE - SOTTO LA GRIGLIA */}
            <div style={{ marginTop: 32 }}>
              {/* RECUPERA INFO FASE */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 25 }}>
                <button
                  type="button"
                  onClick={handleRecuperaFase}
                  style={{
                    width: "85%",
                    padding: "10px 12px",
                    borderRadius: 16,
                    border: "none",
                    fontWeight: 800,
                    fontSize: 28,
                    cursor: "pointer",
                    background: "#A67C00",
                    color: "white",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
                    height: 70,
                  }}
                >
                  Recupera Info Fase
                </button>
              </div>

              {/* ELIMINA FASE */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={handleEliminaFase}
                  style={{
                    height: 100,
                    width: "75%",
                    borderRadius: 16,
                    border: "none",
                    fontWeight: 800,
                    fontSize: 34,
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #A67C00 0%, #B03A2E 100%)",
                    color: "white",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                  }}
                >
                  ELIMINA FASE
                </button>
              </div>
            </div>
          </MacroPage>
        )}

        {page === "raccolta" && (
          <MacroPage title="RACCOLTA E CONSEGNA AL SILOS" onBack={() => setPage("landing")}>
            {/* MODIFICA FASE (in alto) */}
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <button
                type="button"
                onClick={handleModifyFase}
                style={{
                  width: "100%",
                  maxWidth: 640,
                  padding: "18px 16px",
                  borderRadius: 22,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 45,
                  cursor: "pointer",
                  background: "#C9A227",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                  height: 150,
                }}
              >
                MODIFICA FASE
              </button>
            </div>

            {/* 4 fasi */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <button
                onClick={openAppezzamentoAskLottoIdModal}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                TREBBIATURA
              </button>

              <button
                onClick={() => console.log("TRASPORTO")}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                TRASPORTO
              </button>

              <button
                onClick={() => console.log("SCARICO")}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                SCARICO
              </button>

              <button
                onClick={() => console.log("SILOS")}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                SILOS
              </button>
            </div>

            {/* BOTTONI FASE - SOTTO LA GRIGLIA */}
            <div style={{ marginTop: 32 }}>
              {/* RECUPERA INFO FASE */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 25 }}>
                <button
                  type="button"
                  onClick={handleRecuperaFase}
                  style={{
                    width: "85%",
                    padding: "10px 12px",
                    borderRadius: 16,
                    border: "none",
                    fontWeight: 800,
                    fontSize: 28,
                    cursor: "pointer",
                    background: "#A67C00",
                    color: "white",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
                    height: 70,
                  }}
                >
                  Recupera Info Fase
                </button>
              </div>

              {/* ELIMINA FASE */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={handleEliminaFase}
                  style={{
                    height: 100,
                    width: "75%",
                    borderRadius: 16,
                    border: "none",
                    fontWeight: 800,
                    fontSize: 34,
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #A67C00 0%, #B03A2E 100%)",
                    color: "white",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                  }}
                >
                  ELIMINA FASE
                </button>
              </div>
            </div>
          </MacroPage>
        )}

        {page === "stoccaggio" && (
          <MacroPage title="STOCCAGGIO E CONSEGNA A SEMOLIERE" onBack={() => setPage("landing")}>
            {/* MODIFICA FASE (in alto) */}
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <button
                type="button"
                onClick={handleModifyFase}
                style={{
                  width: "100%",
                  maxWidth: 640,
                  padding: "18px 16px",
                  borderRadius: 22,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 45,
                  cursor: "pointer",
                  background: "#C9A227",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                  height: 150,
                }}
              >
                MODIFICA FASE
              </button>
            </div>

            {/* 4 fasi */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <button
                onClick={openAppezzamentoAskLottoIdModal}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                LOTTO
              </button>

              <button
                onClick={() => console.log("TRASPORTO")}
                style={{
                  height: 160,
                  fontSize: 45,
                  fontWeight: 900,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "#A8C64A",
                  color: "#111",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                }}
              >
                TRASPORTO
              </button>

              <button
              onClick={() => console.log("CONSEGNA")}
              style={{
                gridColumn: "1 / -1",
                justifySelf: "center",
                width: "100%",
                maxWidth: 512,

                height: 160,
                fontSize: 45,
                fontWeight: 900,
                borderRadius: 24,
                border: "none",
                cursor: "pointer",
                background: "#A8C64A",
                color: "#111",
                boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
              }}
            >
              CONSEGNA
            </button>
            </div>

            {/* BOTTONI FASE - SOTTO LA GRIGLIA */}
            <div style={{ marginTop: 32 }}>
              {/* RECUPERA INFO FASE */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 25 }}>
                <button
                  type="button"
                  onClick={handleRecuperaFase}
                  style={{
                    width: "85%",
                    padding: "10px 12px",
                    borderRadius: 16,
                    border: "none",
                    fontWeight: 800,
                    fontSize: 28,
                    cursor: "pointer",
                    background: "#A67C00",
                    color: "white",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
                    height: 70,
                  }}
                >
                  Recupera Info Fase
                </button>
              </div>

              {/* ELIMINA FASE */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={handleEliminaFase}
                  style={{
                    height: 100,
                    width: "75%",
                    borderRadius: 16,
                    border: "none",
                    fontWeight: 800,
                    fontSize: 34,
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #A67C00 0%, #B03A2E 100%)",
                    color: "white",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                  }}
                >
                  ELIMINA FASE
                </button>
              </div>
            </div>
          </MacroPage>
        )}

        {/* ==========================
           MODALE: INSERISCI ID LOTTO (prima di APPEZZAMENTO)
        ========================== */}
        {showAppezzAskLottoId && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 10000,
            }}
            onClick={() => setShowAppezzAskLottoId(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 520,
                background: "white",
                borderRadius: 16,
                padding: 18,
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Inserisci ID lotto</div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAppezzAskLottoIdOk();
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>ID lotto per inserire la fase</div>

                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value="GD-"
                    readOnly
                    style={{
                      width: 90,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "#f2f2f2",
                      boxSizing: "border-box",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  />
                  <input
                    value={appezzAskLottoIdRaw}
                    onChange={(e) => setAppezzAskLottoIdRaw(e.target.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      boxSizing: "border-box",
                    }}
                    autoFocus
                  />
                </div>

                {appezzAskLottoIdValidationMsg && (
                  <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 700 }}>
                    {appezzAskLottoIdValidationMsg}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setShowAppezzAskLottoId(false)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    ANNULLA
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "none",
                      background: "#111",
                      color: "white",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    OK
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==========================
           MODALE CREA / MODIFICA LOTTO
        ========================== */}
        {showCreateLotto && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 10000,
            }}
            onClick={() => setShowCreateLotto(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 620,
                background: "white",
                borderRadius: 16,
                padding: 18,
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 10, textAlign: "center" }}>
                {lottoMode === "edit" ? "Modifica Lotto" : "Inserisci Lotto"}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateOrUpdateLotto();
                }}
              >
                <div style={{ display: "grid", gap: 10 }}>
                  {/* ID LOTTO */}
                  {lottoMode === "edit" ? (
                    <>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>ID lotto</div>
                      <input
                        value={buildLottoId(editFullLottoId)}
                        readOnly
                        style={{
                          width: "100%",
                          padding: 16,
                          borderRadius: 14,
                          border: "2px solid #ccc",
                          background: "#f2f2f2",
                          boxSizing: "border-box",
                          fontWeight: 900,
                          fontSize: 30,
                          textAlign: "center",
                          letterSpacing: 1,
                          color: "#111",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>ID lotto</div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <input
                          value="GD-"
                          readOnly
                          style={{
                            width: 90,
                            padding: 12,
                            borderRadius: 12,
                            border: "1px solid #ddd",
                            background: "#f2f2f2",
                            boxSizing: "border-box",
                            fontWeight: 800,
                            textAlign: "center",
                          }}
                        />
                        <input
                          value={createLottoIdRaw}
                          onChange={(e) => setCreateLottoIdRaw(e.target.value)}
                          style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 12,
                            border: "1px solid #ddd",
                            boxSizing: "border-box",
                          }}
                          autoFocus
                        />
                      </div>
                    </>
                  )}

                  {/* CREATOR */}
                  <div style={{ fontWeight: 800, fontSize: 14, marginTop: 8 }}>Nome creatore lotto</div>
                  <input
                    value={createLottoCreator}
                    onChange={(e) => setCreateLottoCreator(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {createLottoValidationMsg && (
                  <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 700 }}>
                    {createLottoValidationMsg}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateLotto(false)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                    disabled={createLottoLoading}
                  >
                    ANNULLA
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "none",
                      background: "#111",
                      color: "white",
                      fontWeight: 900,
                      cursor: "pointer",
                      opacity: createLottoLoading ? 0.7 : 1,
                    }}
                    disabled={createLottoLoading}
                  >
                    {createLottoLoading ? "Invio..." : lottoMode === "edit" ? "MODIFICA" : "CREA"}
                  </button>
                </div>
              </form>

              <div style={{ marginTop: 14, minHeight: 24, fontSize: 13, whiteSpace: "pre-wrap" }}>{createLottoMsg}</div>
            </div>
          </div>
        )}

        {/* ==========================
        MODALE: PRESEMINA_MODIFICA FASE */}
        {showModifyFaseAskLottoId && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 10000,
    }}
    onClick={() => setShowModifyFaseAskLottoId(false)}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        background: "white",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        fontFamily: "Lato, system-ui, sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Modifica Fase</div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleModifyFaseAskLottoIdOk();
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>ID lotto</div>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            value="GD-"
            readOnly
            style={{
              width: 90,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#f2f2f2",
              boxSizing: "border-box",
              fontWeight: 800,
              textAlign: "center",
            }}
          />
          <input
            value={modifyFaseAskLottoIdRaw}
            onChange={(e) => setModifyFaseAskLottoIdRaw(e.target.value)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              boxSizing: "border-box",
            }}
            autoFocus
          />
        </div>

        {modifyFaseAskLottoIdValidationMsg && (
          <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 700 }}>
            {modifyFaseAskLottoIdValidationMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={() => setShowModifyFaseAskLottoId(false)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            ANNULLA
          </button>

          <button
            type="submit"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: "#111",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            OK
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{showModifyFaseModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 10000,
    }}
    onClick={() => setShowModifyFaseModal(false)}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 720,
        background: "white",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        fontFamily: "Lato, system-ui, sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontWeight: 1000, fontSize: 22, textAlign: "center", marginBottom: 6 }}>
        MODIFICA FASE
      </div>

      <div style={{ textAlign: "center", fontWeight: 900, color: "#555", marginBottom: 14 }}>
        Lotto: {modifyFaseTargetLottoId || "GD-—"}
      </div>

      <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 10 }}>
        Seleziona la fase (Presemina e Semina)
      </div>

      {/* LISTA RADIO */}
      <div style={{ display: "grid", gap: 10 }}>
        {[
          "APPEZZAMENTO",
          "LAVORAZIONI",
          "ACQUISIZIONE VARIETÀ",
          "SEMINA",
        ].map((label) => (
          <label
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              background: modifyFaseSelected === label ? "#f6f7fb" : "white",
              fontWeight: 900,
              userSelect: "none",
            }}
          >
            <input
              type="radio"
              name="modify_fase_type"
              value={label}
              checked={modifyFaseSelected === label}
              onChange={() => setModifyFaseSelected(label)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 18 }}>{label}</span>
          </label>
        ))}
      </div>

      {/* BOTTONI */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          type="button"
          onClick={() => setShowModifyFaseModal(false)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          ANNULLA
        </button>

        <button
          type="button"
          disabled={!modifyFaseSelected}
          onClick={() => {
            // per ora placeholder: step successivo lo colleghiamo
            console.log("Selezionata:", modifyFaseSelected, "Lotto:", modifyFaseTargetLottoId);
            // in seguito: qui apriamo la maschera specifica della fase selezionata
          }}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "#111",
            color: "white",
            fontWeight: 1000,
            cursor: modifyFaseSelected ? "pointer" : "not-allowed",
            opacity: modifyFaseSelected ? 1 : 0.6,
          }}
        >
          AVANTI
        </button>
      </div>
    </div>
  </div>
)}



        {/* ==========================
           MODALE: INSERISCI ID PER MODIFICA
        ========================== */}
        {showEditAskId && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 10000,
            }}
            onClick={() => setShowEditAskId(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 520,
                background: "white",
                borderRadius: 16,
                padding: 18,
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Modifica Lotto</div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditAskIdOk();
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>ID lotto da modificare</div>

                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value="GD-"
                    readOnly
                    style={{
                      width: 90,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "#f2f2f2",
                      boxSizing: "border-box",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  />
                  <input
                    value={editAskIdRaw}
                    onChange={(e) => setEditAskIdRaw(e.target.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      boxSizing: "border-box",
                    }}
                    autoFocus
                  />
                </div>

                {editAskIdValidationMsg && (
                  <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 700 }}>
                    {editAskIdValidationMsg}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setShowEditAskId(false)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                    disabled={editAskIdLoading}
                  >
                    ANNULLA
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "none",
                      background: "#111",
                      color: "white",
                      fontWeight: 900,
                      cursor: "pointer",
                      opacity: editAskIdLoading ? 0.7 : 1,
                    }}
                    disabled={editAskIdLoading}
                  >
                    {editAskIdLoading ? "Caricamento..." : "OK"}
                  </button>
                </div>
              </form>

              <div style={{ marginTop: 14, minHeight: 24, fontSize: 13, whiteSpace: "pre-wrap" }}>{editAskIdMsg}</div>
            </div>
          </div>
        )}

        {/* ==========================
           MODALE: RECUPERA INFO LOTTO (ask id)
        ========================== */}
        {showRecuperaAskId && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 10000,
            }}
            onClick={() => setShowRecuperaAskId(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 520,
                background: "white",
                borderRadius: 16,
                padding: 18,
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Recupera Info Lotto</div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRecuperaAskIdOk();
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>ID lotto da recuperare</div>

                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value="GD-"
                    readOnly
                    style={{
                      width: 90,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "#f2f2f2",
                      boxSizing: "border-box",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  />
                  <input
                    value={recuperaAskIdRaw}
                    onChange={(e) => setRecuperaAskIdRaw(e.target.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      boxSizing: "border-box",
                    }}
                    autoFocus
                  />
                </div>

                {recuperaAskIdValidationMsg && (
                  <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 700 }}>
                    {recuperaAskIdValidationMsg}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setShowRecuperaAskId(false)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                    disabled={recuperaAskIdLoading}
                  >
                    ANNULLA
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "none",
                      background: "#111",
                      color: "white",
                      fontWeight: 900,
                      cursor: "pointer",
                      opacity: recuperaAskIdLoading ? 0.7 : 1,
                    }}
                    disabled={recuperaAskIdLoading}
                  >
                    {recuperaAskIdLoading ? "Caricamento..." : "OK"}
                  </button>
                </div>
              </form>

              <div style={{ marginTop: 14, minHeight: 24, fontSize: 13, whiteSpace: "pre-wrap" }}>{recuperaAskIdMsg}</div>
            </div>
          </div>
        )}

        {/* ==========================
           MODALE: VIEWER LOTTO
        ========================== */}
        {showRecuperaViewer && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 10000,
            }}
            onClick={() => setShowRecuperaViewer(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 900,
                maxHeight: "88vh",
                overflow: "auto",
                background: "white",
                borderRadius: 18,
                padding: 18,
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                fontFamily: "Lato, system-ui, sans-serif",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontWeight: 1000, fontSize: 26, marginBottom: 14, textAlign: "center" }}>
                {recuperaViewerData?.__ui_title || "GD-—"}
              </div>

              <div style={{ border: "1px solid #eee", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: 12, background: "#f6f7fb", fontWeight: 1000, fontSize: 16 }}>Dati generali</div>

                <div style={{ display: "grid", gridTemplateColumns: "320px 1fr" }}>
                  <div style={{ padding: 12, borderTop: "1px solid #eee", fontWeight: 1000 }}>Campo</div>
                  <div style={{ padding: 12, borderTop: "1px solid #eee", fontWeight: 1000 }}>Valore</div>

                  {Object.entries(recuperaViewerData?.dati_generali || {}).map(([k, v]) => (
                    <div key={k} style={{ display: "contents" }}>
                      <div style={{ padding: 12, borderTop: "1px solid #eee", background: "#fbfbfd", fontWeight: 900 }}>
                        {k}
                      </div>
                      <div style={{ padding: 12, borderTop: "1px solid #eee", whiteSpace: "pre-wrap", fontWeight: 700 }}>
                        {valueToText(v)}
                      </div>
                    </div>
                  ))}

                  {Object.keys(recuperaViewerData?.dati_generali || {}).length === 0 && (
                    <>
                      <div style={{ padding: 12, borderTop: "1px solid #eee", background: "#fbfbfd", fontWeight: 900 }}>—</div>
                      <div style={{ padding: 12, borderTop: "1px solid #eee", color: "#666" }}>Nessun dato generale presente.</div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ border: "1px solid #eee", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: 12, background: "#f6f7fb", fontWeight: 1000, fontSize: 16 }}>Fasi</div>

                {(recuperaViewerData?.fasi || []).length === 0 ? (
                  <div style={{ padding: 12, color: "#666", fontWeight: 700 }}>Nessuna fase presente per questo lotto.</div>
                ) : (
                  <div style={{ padding: 12 }}>{/* in futuro espandiamo */}</div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => setShowRecuperaViewer(false)}
                  style={{
                    width: 240,
                    padding: 12,
                    borderRadius: 12,
                    border: "none",
                    background: "#111",
                    color: "white",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  CHIUDI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================
           MODALE: APPEZZAMENTO (POST reale)
        ========================== */}
        {showAppezzamento && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 10000,
            }}
            onClick={() => setShowAppezzamento(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 860,
                background: "white",
                borderRadius: 16,
                padding: 18,
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                fontFamily: "Lato, system-ui, sans-serif",
                maxHeight: "88vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontWeight: 1000, fontSize: 22, textAlign: "center", marginBottom: 12 }}>
                PRESEMINA E SEMINA — APPEZZAMENTO
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitAppezzamento();
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 8 }}>Nome</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <input
                    value={APPEZZ_PREFIX}
                    readOnly
                    style={{
                      width: 320,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "#f2f2f2",
                      boxSizing: "border-box",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  />
                  <input
                    value={appNomeRaw}
                    onChange={(e) => setAppNomeRaw(e.target.value)}
                    style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box" }}
                    autoFocus
                  />
                </div>

                <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>Operatore</div>
                <input
                  value={appOperatore}
                  onChange={(e) => setAppOperatore(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #ddd",
                    boxSizing: "border-box",
                    marginBottom: 14,
                  }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Codice appezzamento" value={appCodice} onChange={setAppCodice} />
                  <Field label="Superficie (ha)" value={appSuperficie} onChange={setAppSuperficie} />
                  <Field label="Comune" value={appComune} onChange={setAppComune} />
                  <Field label="Provincia" value={appProvincia} onChange={setAppProvincia} />
                  <Field label="Lat" value={appLat} onChange={setAppLat} />
                  <Field label="Lon" value={appLon} onChange={setAppLon} />
                </div>

                {appValidationMsg && (
                  <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 800 }}>{appValidationMsg}</div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setShowAppezzamento(false)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "white",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                    disabled={appSubmitLoading}
                  >
                    ANNULLA
                  </button>

                  <button
                    type="submit"
                    disabled={appSubmitLoading}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "none",
                      background: "#111",
                      color: "white",
                      fontWeight: 1000,
                      cursor: "pointer",
                      opacity: appSubmitLoading ? 0.7 : 1,
                    }}
                  >
                    {appSubmitLoading ? "Invio..." : "INSERISCI FASE"}
                  </button>
                </div>
              </form>

              {appSubmitMsg && (
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 900, whiteSpace: "pre-wrap" }}>{appSubmitMsg}</div>
              )}

              {appJsonPreview && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 1000, marginBottom: 8 }}>JSON generato</div>
                  <pre
                    style={{
                      margin: 0,
                      padding: 14,
                      borderRadius: 12,
                      background: "#0f172a",
                      color: "white",
                      fontSize: 12,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.35,
                    }}
                  >
                    {JSON.stringify(appJsonPreview, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODALE - Recupera Info Fase Ask */}
        {showRecuperaFaseAsk && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 10000,
    }}
    onClick={() => setShowRecuperaFaseAsk(false)}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        background: "white",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        fontFamily: "Lato, system-ui, sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontWeight: 1000, fontSize: 20, marginBottom: 10 }}>
        Recupera Info Fase
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRecuperaFaseAskOk();
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 8 }}>ID lotto</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input
            value="GD-"
            readOnly
            style={{
              width: 90,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#f2f2f2",
              boxSizing: "border-box",
              fontWeight: 800,
              textAlign: "center",
            }}
          />
          <input
            value={recFaseLottoIdRaw}
            onChange={(e) => setRecFaseLottoIdRaw(e.target.value)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              boxSizing: "border-box",
            }}
            autoFocus
          />
        </div>

        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 10 }}>
  Seleziona fase (PRESEMINA E SEMINA)
</div>

<div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
  {["APPEZZAMENTO", "LAVORAZIONI", "ACQUISIZIONE VARIETÀ", "SEMINA"].map((label) => (
    <label
      key={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        background: recFaseTipo === label ? "#f6f7fb" : "white",
        fontWeight: 900,
        userSelect: "none",
      }}
    >
      <input
        type="radio"
        name="rec_fase_tipo"
        value={label}
        checked={recFaseTipo === label}
        onChange={() => setRecFaseTipo(label)}
        style={{ width: 18, height: 18 }}
      />
      <span style={{ fontSize: 18 }}>{label}</span>
    </label>
  ))}
</div>

<div style={{ fontWeight: 900, fontSize: 14, marginBottom: 8 }}>Nome fase</div>

<div style={{ display: "flex", gap: 10 }}>
  {/* prefisso auto, stile "GD-" */}
  <input
    value={PRESEMINA_FASE_PREFIX[recFaseTipo] || ""}
    readOnly
    style={{
      width: 320,
      padding: 12,
      borderRadius: 12,
      border: "1px solid #ddd",
      background: "#f2f2f2",
      boxSizing: "border-box",
      fontWeight: 900,
      textAlign: "center",
    }}
  />

    <input
      value={recFaseSuffix}
      onChange={(e) => setRecFaseSuffix(e.target.value)}
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 12,
        border: "1px solid #ddd",
        boxSizing: "border-box",
      }}
      disabled={!recFaseTipo}
    />
  </div>

<div style={{ marginTop: 10, fontSize: 13, fontWeight: 900, color: "#555" }}>
  Nome completo: {recFaseTipo && recFaseSuffix.trim() ? buildPreseminaFaseNome(recFaseTipo, recFaseSuffix) : "—"}
</div>


        {recFaseAskValidationMsg && (
          <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 800 }}>
            {recFaseAskValidationMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={() => setShowRecuperaFaseAsk(false)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "white",
              fontWeight: 900,
              cursor: "pointer",
            }}
            disabled={recFaseAskLoading}
          >
            ANNULLA
          </button>

          <button
            type="submit"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: "#111",
              color: "white",
              fontWeight: 1000,
              cursor: "pointer",
              opacity: recFaseAskLoading ? 0.7 : 1,
            }}
            disabled={recFaseAskLoading}
          >
            {recFaseAskLoading ? "Caricamento..." : "OK"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 14, minHeight: 24, fontSize: 13, whiteSpace: "pre-wrap" }}>
        {recFaseAskMsg}
      </div>
    </div>
  </div>
)}

{/* MODALE - Recupera Info Fase Viewer */}
{showRecuperaFaseViewer && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 10000,
    }}
    onClick={() => setShowRecuperaFaseViewer(false)}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        maxHeight: "88vh",
        overflow: "auto",
        background: "white",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        fontFamily: "Lato, system-ui, sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontWeight: 1000, fontSize: 26, marginBottom: 6, textAlign: "center" }}>
        {recuperaFaseViewerData?.__ui_title || "Fase: —"}
      </div>

      <div style={{ textAlign: "center", fontWeight: 900, color: "#555", marginBottom: 14 }}>
        Lotto: {recuperaFaseViewerData?.__ui_lotto || "GD-—"}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: 12, background: "#f6f7fb", fontWeight: 1000, fontSize: 16 }}>
          Dettagli fase
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr" }}>
          <div style={{ padding: 12, borderTop: "1px solid #eee", fontWeight: 1000 }}>Campo</div>
          <div style={{ padding: 12, borderTop: "1px solid #eee", fontWeight: 1000 }}>Valore</div>

          {Object.entries(recuperaFaseViewerData?.dettagli || {}).map(([k, v]) => (
            <div key={k} style={{ display: "contents" }}>
              <div style={{ padding: 12, borderTop: "1px solid #eee", background: "#fbfbfd", fontWeight: 900 }}>
                {k}
              </div>
              <div style={{ padding: 12, borderTop: "1px solid #eee", whiteSpace: "pre-wrap", fontWeight: 700 }}>
                {valueToText(v)}
              </div>
            </div>
          ))}

          {Object.keys(recuperaFaseViewerData?.dettagli || {}).length === 0 && (
            <>
              <div style={{ padding: 12, borderTop: "1px solid #eee", background: "#fbfbfd", fontWeight: 900 }}>—</div>
              <div style={{ padding: 12, borderTop: "1px solid #eee", color: "#666" }}>
                Nessun dettaglio presente per questa fase.
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => setShowRecuperaFaseViewer(false)}
          style={{
            width: 240,
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "#111",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          CHIUDI
        </button>
      </div>
    </div>
  </div>
)}

        {/* ==========================
           MODALE: ELIMINA FASE
        ========================== */}

        {showDeleteFaseAsk && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 10000,
    }}
    onClick={() => setShowDeleteFaseAsk(false)}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        background: "white",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        fontFamily: "Lato, system-ui, sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontWeight: 1000, fontSize: 20, marginBottom: 10 }}>
        Elimina Fase
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDeleteFaseAskOk();
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 8 }}>ID lotto</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input
            value="GD-"
            readOnly
            style={{
              width: 90,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#f2f2f2",
              boxSizing: "border-box",
              fontWeight: 800,
              textAlign: "center",
            }}
          />
          <input
            value={delFaseLottoIdRaw}
            onChange={(e) => setDelFaseLottoIdRaw(e.target.value)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              boxSizing: "border-box",
            }}
            autoFocus
          />
        </div>

        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 10 }}>
  Seleziona fase (PRESEMINA E SEMINA)
</div>

<div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
  {["APPEZZAMENTO", "LAVORAZIONI", "ACQUISIZIONE VARIETÀ", "SEMINA"].map((label) => (
    <label
      key={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        background: delFaseTipo === label ? "#f6f7fb" : "white",
        fontWeight: 900,
        userSelect: "none",
      }}
    >
      <input
        type="radio"
        name="del_fase_tipo"
        value={label}
        checked={delFaseTipo === label}
        onChange={() => setDelFaseTipo(label)}
        style={{ width: 18, height: 18 }}
      />
      <span style={{ fontSize: 18 }}>{label}</span>
    </label>
  ))}
</div>

<div style={{ fontWeight: 900, fontSize: 14, marginBottom: 8 }}>Nome fase</div>

<div style={{ display: "flex", gap: 10 }}>
  <input
    value={PRESEMINA_FASE_PREFIX[delFaseTipo] || ""}
    readOnly
    style={{
      width: 320,
      padding: 12,
      borderRadius: 12,
      border: "1px solid #ddd",
      background: "#f2f2f2",
      boxSizing: "border-box",
      fontWeight: 900,
      textAlign: "center",
    }}
  />

  <input
    value={delFaseSuffix}
    onChange={(e) => setDelFaseSuffix(e.target.value)}
    style={{
      flex: 1,
      padding: 12,
      borderRadius: 12,
      border: "1px solid #ddd",
      boxSizing: "border-box",
    }}
    disabled={!delFaseTipo}
  />
</div>

<div style={{ marginTop: 10, fontSize: 13, fontWeight: 900, color: "#555" }}>
  Nome completo: {delFaseTipo && delFaseSuffix.trim() ? buildPreseminaFaseNome(delFaseTipo, delFaseSuffix) : "—"}
</div>

        {delFaseAskValidationMsg && (
          <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 800 }}>
            {delFaseAskValidationMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={() => setShowDeleteFaseAsk(false)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "white",
              fontWeight: 900,
              cursor: "pointer",
            }}
            disabled={delFaseAskLoading}
          >
            ANNULLA
          </button>

          <button
            type="submit"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: "#B03A2E",
              color: "white",
              fontWeight: 1000,
              cursor: "pointer",
              opacity: delFaseAskLoading ? 0.7 : 1,
            }}
            disabled={delFaseAskLoading}
          >
            {delFaseAskLoading ? "Eliminazione..." : "ELIMINA"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 14, minHeight: 24, fontSize: 13, whiteSpace: "pre-wrap" }}>
        {delFaseAskMsg}
      </div>
    </div>
  </div>
)}


        {/* ==========================
           MODALE: ELIMINA LOTTO
        ========================== */}
        {showDeleteLotto && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 9999,
            }}
            onClick={() => setShowDeleteLotto(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 520,
                background: "white",
                borderRadius: 16,
                padding: 18,
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Inserisci l'ID del lotto da eliminare</div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteLotto();
                }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value="GD-"
                    readOnly
                    style={{
                      width: 90,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "#f2f2f2",
                      boxSizing: "border-box",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  />
                  <input
                    value={deleteLottoId}
                    onChange={(e) => setDeleteLottoId(e.target.value)}
                    style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box" }}
                    autoFocus
                  />
                </div>

                {deleteLottoValidationMsg && (
                  <div style={{ marginTop: 10, color: "#b00020", fontSize: 13, fontWeight: 700 }}>{deleteLottoValidationMsg}</div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setShowDeleteLotto(false)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                    disabled={deleteLottoLoading}
                  >
                    ANNULLA
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "none",
                      background: "#111",
                      color: "white",
                      fontWeight: 900,
                      cursor: "pointer",
                      opacity: deleteLottoLoading ? 0.7 : 1,
                    }}
                    disabled={deleteLottoLoading}
                  >
                    {deleteLottoLoading ? "Eliminazione..." : "OK"}
                  </button>
                </div>
              </form>

              <div style={{ marginTop: 14, minHeight: 24, fontSize: 13, whiteSpace: "pre-wrap" }}>{deleteLottoMsg}</div>
            </div>
          </div>
        )}
      </>
    );
  }


  /* ==========================
     LOGIN SCREEN
  ========================== */
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

            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Username"
              style={{ width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box" }}
            />

            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              style={{ width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box" }}
              type="password"
            />

            {error && <div style={{ color: "#b00020", fontSize: 13, marginBottom: 10 }}>{error}</div>}

            <button
              onClick={login}
              disabled={loading}
              style={{
                width: "100%",
                padding: 12,
                background: "#111",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
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

/* ====== helper field (solo UI) ====== */
function Field({ label, value, onChange }) {
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box" }}
      />
    </div>
  );
}
