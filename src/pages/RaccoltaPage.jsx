import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import MacroPage from "../components/MacroPage";
import FaseModal from "../components/FaseModal";
import { ModalOverlay, ModalButtons, LottoIdInput, ValidationMsg, StatusMsg, FaseRadioList, KVTable, FasiTable } from "../components/UI";
import { TrebbiaturaForm, TrebbiaturaInitial, buildTrebbiaturaPayload } from "../components/fasi/TrebbiaturaForm";
import { TrasportoRaccoltaForm, TrasportoRaccoltaInitial, buildTrasportoRaccoltaPayload } from "../components/fasi/TrasportoRaccoltaForm";
import { ScaricoForm, ScaricoInitial, buildScaricoPayload } from "../components/fasi/ScaricoForm";
import { SilosForm, SilosInitial, buildSilosPayload } from "../components/fasi/SilosForm";
import { BTN_GREEN, FASE_PREFIX, FASI_RACCOLTA, FASE_LABEL } from "../constants";
import { buildLottoId, buildFaseNome, extractApiError } from "../utils";
import { apiGetFase, apiDeleteFase, apiGetLottoFasi } from "../api";

const bigFaseBtn = { height: 160, fontSize: 40, fontWeight: 900, borderRadius: 24, border: "none", cursor: "pointer", background: BTN_GREEN, color: "#111", boxShadow: "0 10px 25px rgba(0,0,0,0.10)" };
const FASI_OPTIONS = FASI_RACCOLTA.map((k) => ({ value: k, label: FASE_LABEL[k] }));

/**
 * AskLottoModal — asks for lotto ID and then calls onConfirm(lottoId).
 * Trebbiatura also fetches appezzamenti once the ID is confirmed.
 */
function AskLottoModal({ show, onClose, onConfirm, title = "Inserisci ID lotto" }) {
  const [raw, setRaw] = useState("");
  const [err, setErr] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!raw.trim()) { setErr("Obbligatorio"); return; }
    onConfirm(buildLottoId(raw));
    setRaw(""); setErr("");
  }
  if (!show) return null;
  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 14 }}>{title}</div>
      <form onSubmit={handleSubmit}>
        <LottoIdInput value={raw} onChange={setRaw} autoFocus />
        <ValidationMsg msg={err} />
        <ModalButtons onCancel={onClose} confirmLabel="AVANTI" />
      </form>
    </ModalOverlay>
  );
}

function FaseAskModal({ show, onClose, mode, onConfirm }) {
  const [lottoRaw, setLottoRaw] = useState("");
  const [tipo, setTipo] = useState("");
  const [suffix, setSuffix] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  function reset() { setLottoRaw(""); setTipo(""); setSuffix(""); setValidationMsg(""); setStatusMsg(""); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!lottoRaw.trim() || !tipo || !suffix.trim()) { setValidationMsg("Compilare tutti i campi richiesti"); return; }
    setValidationMsg(""); setLoading(true); setStatusMsg("");
    await onConfirm(buildLottoId(lottoRaw), buildFaseNome(tipo, suffix), setStatusMsg);
    setLoading(false);
  }
  if (!show) return null;
  const isElimina = mode === "elimina";
  return (
    <ModalOverlay onClose={() => { reset(); onClose(); }}>
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 16 }}>
        {isElimina ? "Elimina Fase" : "Recupera Info Fase"}
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>ID lotto</div>
        <div style={{ marginBottom: 14 }}><LottoIdInput value={lottoRaw} onChange={setLottoRaw} autoFocus /></div>
        <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>Seleziona fase</div>
        <FaseRadioList options={FASI_OPTIONS} value={tipo} onChange={setTipo} name={`raccolta_${mode}_tipo`} />
        <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>Nome fase</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={FASE_PREFIX[tipo] || ""} readOnly
            style={{ flex: 2, padding: 10, borderRadius: 10, border: "1px solid #ddd", background: "#f2f2f2", fontWeight: 700, fontSize: 12 }} />
          <input value={suffix} onChange={(e) => setSuffix(e.target.value)} disabled={!tipo}
            style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        </div>
        <ValidationMsg msg={validationMsg} />
        <ModalButtons onCancel={() => { reset(); onClose(); }} loading={loading}
          confirmLabel={isElimina ? "ELIMINA" : "CERCA"}
          confirmStyle={isElimina ? { background: "#B03A2E" } : {}} />
      </form>
      <StatusMsg msg={statusMsg} />
    </ModalOverlay>
  );
}

function FaseViewerModal({ show, onClose, data }) {
  if (!show || !data) return null;
  return (
    <ModalOverlay onClose={onClose} maxWidth={860}>
      <div style={{ textAlign: "center", fontWeight: 1000, fontSize: 22, marginBottom: 4 }}>{data.__ui_title}</div>
      <div style={{ textAlign: "center", color: "#666", fontWeight: 700, marginBottom: 16 }}>Lotto: {data.__ui_lotto}</div>
      <FasiTable title="Dettagli fase" data={data || {}} />
      
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={onClose} type="button"
          style={{ padding: "10px 32px", borderRadius: 12, border: "none", background: "#111", color: "white", fontWeight: 900, cursor: "pointer" }}>
          CHIUDI
        </button>
      </div>
    </ModalOverlay>
  );
}

export default function RaccoltaPage({ onBack }) {
  const { user, pass } = useAuth();

  const [activeFase, setActiveFase]   = useState(null);
  const [targetLotto, setTargetLotto] = useState("");
  const [faseSuffix, setFaseSuffix]   = useState("");
  const [appezzamenti, setAppezzamenti] = useState([]);
  const [loadingAppezzamenti, setLoadingAppezzamenti] = useState(false);

  const [showAskLotto, setShowAskLotto] = useState(false);
  const [pendingFase, setPendingFase]   = useState(null);

  const [showRecupera, setShowRecupera] = useState(false);
  const [showElimina, setShowElimina]   = useState(false);
  const [faseViewerData, setFaseViewerData] = useState(null);
  const [showViewer, setShowViewer]     = useState(false);

  // When targetLotto is set for TREBBIATURA, fetch appezzamenti
  useEffect(() => {
    if (activeFase !== "TREBBIATURA" || !targetLotto) return;
    setLoadingAppezzamenti(true);
    apiGetLottoFasi(user, pass, targetLotto)
      .then((data) => {
        const fasi = Array.isArray(data) ? data : (data?.fasi || []);
        const opts = fasi
          .filter((f) => {
            const nome = typeof f === "string" ? f : f?.nome || "";
            return nome.startsWith("presemina_appezzamento-");
          })
          .map((f) => {
            const nome = typeof f === "string" ? f : f?.nome || "";
            return { value: nome, label: nome };
          });
        setAppezzamenti(opts);
      })
      .catch(() => setAppezzamenti([]))
      .finally(() => setLoadingAppezzamenti(false));
  }, [activeFase, targetLotto]);

  function openFase(faseKey) {
    setPendingFase(faseKey);
    setShowAskLotto(true);
  }

  async function handleRecuperaConfirm(lottoId, faseName, setMsg) {
    try {
      const root = await apiGetFase(user, pass, lottoId, faseName);
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
      __ui_lotto: lottoId,
    };
      setFaseViewerData(normalized);
      setShowRecupera(false); setShowViewer(true);
    } catch (err) { setMsg(extractApiError(err)); }
  }

  async function handleEliminaConfirm(lottoId, faseName, setMsg) {
    try {
      const res = await apiDeleteFase(user, pass, lottoId, faseName);
      setMsg(res?.message ? `OK: ${res.message}` : "OK: Fase eliminata");
    } catch (err) { setMsg(extractApiError(err)); }
  }

  const faseConfig = {
    TREBBIATURA:       { renderForm: TrebbiaturaForm,      initialFields: TrebbiaturaInitial,       buildPayload: buildTrebbiaturaPayload,      title: "TREBBIATURA" },
    TRASPORTO_RACCOLTA:{ renderForm: TrasportoRaccoltaForm, initialFields: TrasportoRaccoltaInitial, buildPayload: buildTrasportoRaccoltaPayload, title: "TRASPORTO" },
    SCARICO:           { renderForm: ScaricoForm,          initialFields: ScaricoInitial,           buildPayload: buildScaricoPayload,           title: "SCARICO" },
    SILOS:             { renderForm: SilosForm,            initialFields: SilosInitial,             buildPayload: buildSilosPayload,             title: "SILOS" },
  };
  const cfg = activeFase ? faseConfig[activeFase] : null;

  return (
    <MacroPage title="RACCOLTA E CONSEGNA AL SILOS" onBack={onBack} onModifica={() => {}}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <button style={bigFaseBtn} onClick={() => openFase("TREBBIATURA")}>TREBBIATURA</button>
        <button style={bigFaseBtn} onClick={() => openFase("TRASPORTO_RACCOLTA")}>TRASPORTO</button>
        <button style={bigFaseBtn} onClick={() => openFase("SCARICO")}>SCARICO</button>
        <button style={bigFaseBtn} onClick={() => openFase("SILOS")}>SILOS</button>
      </div>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <button onClick={() => setShowRecupera(true)}
          style={{ width: "85%", height: 70, borderRadius: 16, border: "none", fontWeight: 800, fontSize: 28, cursor: "pointer", background: "#A67C00", color: "white" }}>
          Recupera Info Fase
        </button>
        <button onClick={() => setShowElimina(true)}
          style={{ height: 100, width: "75%", borderRadius: 16, border: "none", fontWeight: 800, fontSize: 34, cursor: "pointer", background: "linear-gradient(135deg, #A67C00 0%, #B03A2E 100%)", color: "white" }}>
          ELIMINA FASE
        </button>
      </div>

      <AskLottoModal show={showAskLotto} onClose={() => setShowAskLotto(false)}
        onConfirm={(lottoId) => { setTargetLotto(lottoId); setFaseSuffix(""); setActiveFase(pendingFase); setShowAskLotto(false); }} />

      {cfg && (
        <FaseModal
          show={!!activeFase}
          onClose={() => { setActiveFase(null); setAppezzamenti([]); }}
          title={cfg.title}
          lottoId={targetLotto}
          faseType={activeFase}
          renderForm={cfg.renderForm}
          buildPayload={cfg.buildPayload}
          initialFields={cfg.initialFields}
          suffix={faseSuffix}
          setSuffix={setFaseSuffix}
          onSuccess={() => { setActiveFase(null); setAppezzamenti([]); }}
          extraProps={activeFase === "TREBBIATURA" ? { appezzamenti, loadingAppezzamenti } : {}}
        />
      )}

      <FaseAskModal show={showRecupera} onClose={() => setShowRecupera(false)} mode="recupera" onConfirm={handleRecuperaConfirm} />
      <FaseAskModal show={showElimina}  onClose={() => setShowElimina(false)}  mode="elimina"  onConfirm={handleEliminaConfirm} />
      <FaseViewerModal show={showViewer} onClose={() => setShowViewer(false)} data={faseViewerData} />
    </MacroPage>
  );
}