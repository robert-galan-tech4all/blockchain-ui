import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import MacroPage from "../components/MacroPage";
import FaseModal from "../components/FaseModal";
import { ModalOverlay, ModalButtons, LottoIdInput, ValidationMsg, StatusMsg, FaseRadioList, KVTable } from "../components/UI";
import { LottoStoccaggioForm, LottoStoccaggioInitial, buildLottoStoccaggioPayload } from "../components/fasi/LottoStoccaggioForm";
import { TrasportoStoccaggioForm, TrasportoStoccaggioInitial, buildTrasportoStoccaggioPayload } from "../components/fasi/TrasportoStoccaggioForm";
import { ConsegnaForm, ConsegnaInitial, buildConsegnaPayload } from "../components/fasi/ConsegnaForm";
import { BTN_GREEN, FASE_PREFIX, FASI_STOCCAGGIO, FASE_LABEL } from "../constants";
import { buildLottoId, buildFaseNome, extractApiError } from "../utils";
import { apiGetFase, apiDeleteFase } from "../api";

const bigFaseBtn = { height: 160, fontSize: 40, fontWeight: 900, borderRadius: 24, border: "none", cursor: "pointer", background: BTN_GREEN, color: "#111", boxShadow: "0 10px 25px rgba(0,0,0,0.10)" };
const FASI_OPTIONS = FASI_STOCCAGGIO.map((k) => ({ value: k, label: FASE_LABEL[k] }));

function AskLottoModal({ show, onClose, onConfirm }) {
  const [raw, setRaw] = useState("");
  const [err, setErr] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!raw.trim()) { setErr("Obbligatorio"); return; }
    onConfirm(buildLottoId(raw)); setRaw(""); setErr("");
  }
  if (!show) return null;
  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 14 }}>Inserisci ID lotto</div>
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
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 16 }}>{isElimina ? "Elimina Fase" : "Recupera Info Fase"}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}><LottoIdInput value={lottoRaw} onChange={setLottoRaw} autoFocus /></div>
        <FaseRadioList options={FASI_OPTIONS} value={tipo} onChange={setTipo} name={`stoccaggio_${mode}_tipo`} />
        <div style={{ display: "flex", gap: 8 }}>
          <input value={FASE_PREFIX[tipo] || ""} readOnly style={{ flex: 2, padding: 10, borderRadius: 10, border: "1px solid #ddd", background: "#f2f2f2", fontWeight: 700, fontSize: 12 }} />
          <input value={suffix} onChange={(e) => setSuffix(e.target.value)} disabled={!tipo} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        </div>
        <ValidationMsg msg={validationMsg} />
        <ModalButtons onCancel={() => { reset(); onClose(); }} loading={loading}
          confirmLabel={isElimina ? "ELIMINA" : "CERCA"} confirmStyle={isElimina ? { background: "#B03A2E" } : {}} />
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
      <div style={{ textAlign: "center", color: "#666", marginBottom: 16 }}>Lotto: {data.__ui_lotto}</div>
      <KVTable title="Dettagli fase" data={data.dettagli || {}} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={onClose} type="button" style={{ padding: "10px 32px", borderRadius: 12, border: "none", background: "#111", color: "white", fontWeight: 900, cursor: "pointer" }}>CHIUDI</button>
      </div>
    </ModalOverlay>
  );
}

export default function StoccaggioPage({ onBack }) {
  const { user, pass } = useAuth();
  const [activeFase, setActiveFase]   = useState(null);
  const [targetLotto, setTargetLotto] = useState("");
  const [faseSuffix, setFaseSuffix]   = useState("");
  const [showAskLotto, setShowAskLotto] = useState(false);
  const [pendingFase, setPendingFase]   = useState(null);
  const [showRecupera, setShowRecupera] = useState(false);
  const [showElimina, setShowElimina]   = useState(false);
  const [faseViewerData, setFaseViewerData] = useState(null);
  const [showViewer, setShowViewer]     = useState(false);

  function openFase(faseKey) { setPendingFase(faseKey); setShowAskLotto(true); }

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
    LOTTO_STOCCAGGIO:     { renderForm: LottoStoccaggioForm,      initialFields: LottoStoccaggioInitial,       buildPayload: buildLottoStoccaggioPayload,      title: "LOTTO" },
    TRASPORTO_STOCCAGGIO: { renderForm: TrasportoStoccaggioForm,  initialFields: TrasportoStoccaggioInitial,   buildPayload: buildTrasportoStoccaggioPayload,   title: "TRASPORTO" },
    CONSEGNA:             { renderForm: ConsegnaForm,             initialFields: ConsegnaInitial,              buildPayload: buildConsegnaPayload,              title: "CONSEGNA" },
  };
  const cfg = activeFase ? faseConfig[activeFase] : null;

  return (
    <MacroPage title="STOCCAGGIO E CONSEGNA A SEMOLIERE" onBack={onBack} onModifica={() => {}}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <button style={bigFaseBtn} onClick={() => openFase("LOTTO_STOCCAGGIO")}>LOTTO</button>
        <button style={bigFaseBtn} onClick={() => openFase("TRASPORTO_STOCCAGGIO")}>TRASPORTO</button>
        <button style={{ ...bigFaseBtn, gridColumn: "1 / -1", justifySelf: "center", width: "100%", maxWidth: 512 }} onClick={() => openFase("CONSEGNA")}>CONSEGNA</button>
      </div>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <button onClick={() => setShowRecupera(true)} style={{ width: "85%", height: 70, borderRadius: 16, border: "none", fontWeight: 800, fontSize: 28, cursor: "pointer", background: "#A67C00", color: "white" }}>
          Recupera Info Fase
        </button>
        <button onClick={() => setShowElimina(true)} style={{ height: 100, width: "75%", borderRadius: 16, border: "none", fontWeight: 800, fontSize: 34, cursor: "pointer", background: "linear-gradient(135deg, #A67C00 0%, #B03A2E 100%)", color: "white" }}>
          ELIMINA FASE
        </button>
      </div>

      <AskLottoModal show={showAskLotto} onClose={() => setShowAskLotto(false)}
        onConfirm={(lottoId) => { setTargetLotto(lottoId); setFaseSuffix(""); setActiveFase(pendingFase); setShowAskLotto(false); }} />

      {cfg && (
        <FaseModal
          show={!!activeFase} onClose={() => setActiveFase(null)}
          title={cfg.title} lottoId={targetLotto} faseType={activeFase}
          renderForm={cfg.renderForm} buildPayload={cfg.buildPayload}
          initialFields={cfg.initialFields} suffix={faseSuffix} setSuffix={setFaseSuffix}
          onSuccess={() => setActiveFase(null)}
        />
      )}

      <FaseAskModal show={showRecupera} onClose={() => setShowRecupera(false)} mode="recupera" onConfirm={handleRecuperaConfirm} />
      <FaseAskModal show={showElimina}  onClose={() => setShowElimina(false)}  mode="elimina"  onConfirm={handleEliminaConfirm} />
      <FaseViewerModal show={showViewer} onClose={() => setShowViewer(false)} data={faseViewerData} />
    </MacroPage>
  );
}