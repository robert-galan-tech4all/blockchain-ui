import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import MacroPage from "../components/MacroPage";
import FaseModal from "../components/FaseModal";
import { ModalOverlay, ModalButtons, LottoIdInput, ValidationMsg, StatusMsg, FaseRadioList, KVTable, FasiTable } from "../components/UI";
import { AppezzamentoForm, AppezzamentoInitial, buildAppezzamentoPayload } from "../components/fasi/AppezzamentoForm";
import { AcquisizioneVarietaForm, AcquisizioneVarietaInitial, buildAcquisizioneVarietaPayload } from "../components/fasi/AcquisizioneVarietaForm";
import { SeminaForm, SeminaInitial, buildSeminaPayload } from "../components/fasi/SeminaForm";
import { BTN_GREEN, FASE_PREFIX, FASI_PRESEMINA, FASE_LABEL } from "../constants";
import { buildLottoId, buildFaseNome, extractApiError } from "../utils";
import { apiGetFase, apiDeleteFase, apiGetLotto } from "../api";

const bigFaseBtn = { height: 160, fontSize: 40, fontWeight: 900, borderRadius: 24, border: "none", cursor: "pointer", background: BTN_GREEN, color: "#111", boxShadow: "0 10px 25px rgba(0,0,0,0.10)" };

// ── Helper: AskLottoId + FaseTipo modal (Recupera & Elimina) ─────────────
function FaseAskModal({ show, onClose, mode, onConfirm, faseOptions }) {
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
        <FaseRadioList options={faseOptions} value={tipo} onChange={setTipo} name={`${mode}_tipo`} />
        <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>Nome fase</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={FASE_PREFIX[tipo] || ""} readOnly
            style={{ flex: 2, padding: 10, borderRadius: 10, border: "1px solid #ddd", background: "#f2f2f2", fontWeight: 700, fontSize: 12 }} />
          <input value={suffix} onChange={(e) => setSuffix(e.target.value)} disabled={!tipo}
            style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        </div>
        <ValidationMsg msg={validationMsg} />
        <ModalButtons
          onCancel={() => { reset(); onClose(); }} loading={loading}
          confirmLabel={isElimina ? "ELIMINA" : "CERCA"}
          confirmStyle={isElimina ? { background: "#B03A2E" } : {}}
        />
      </form>
      <StatusMsg msg={statusMsg} />
    </ModalOverlay>
  );
}

// ── Helper: FaseViewerModal ───────────────────────────────────────────────
function FaseViewerModal({ show, onClose, data }) {
  if (!show || !data) return null;
  return (
    <ModalOverlay onClose={onClose} maxWidth={860}>
      <div style={{ textAlign: "center", fontWeight: 1000, fontSize: 22, marginBottom: 4 }}>{data.__ui_title}</div>
      <div style={{ textAlign: "center", color: "#666", fontWeight: 700, marginBottom: 16 }}>Lotto: {data.__ui_lotto}</div>
      <FasiTable title="Dettagli fase" data={data.dettagli || {}} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={onClose} type="button"
          style={{ padding: "10px 32px", borderRadius: 12, border: "none", background: "#111", color: "white", fontWeight: 900, cursor: "pointer" }}>
          CHIUDI
        </button>
      </div>
    </ModalOverlay>
  );
}

// ── Helper: ModifyFaseModal ───────────────────────────────────────────────
function ModifyFaseModal({ show, onClose, onProceed, faseOptions }) {
  const [step, setStep] = useState(1);
  const [lottoRaw, setLottoRaw] = useState("");
  const [tipo, setTipo] = useState("");
  const [validationMsg, setValidationMsg] = useState("");

  function reset() { setStep(1); setLottoRaw(""); setTipo(""); setValidationMsg(""); }

  if (!show) return null;
  if (step === 1) {
    return (
      <ModalOverlay onClose={() => { reset(); onClose(); }}>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 16 }}>Modifica Fase — ID Lotto</div>
        <form onSubmit={(e) => { e.preventDefault(); if (!lottoRaw.trim()) { setValidationMsg("Obbligatorio"); return; } setValidationMsg(""); setStep(2); }}>
          <LottoIdInput value={lottoRaw} onChange={setLottoRaw} autoFocus />
          <ValidationMsg msg={validationMsg} />
          <ModalButtons onCancel={() => { reset(); onClose(); }} confirmLabel="AVANTI" />
        </form>
      </ModalOverlay>
    );
  }
  return (
    <ModalOverlay onClose={() => { reset(); onClose(); }}>
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 4 }}>Modifica Fase</div>
      <div style={{ color: "#555", marginBottom: 14 }}>Lotto: {buildLottoId(lottoRaw)}</div>
      <FaseRadioList options={faseOptions} value={tipo} onChange={setTipo} name="modify_tipo" />
      <ModalButtons
        onCancel={() => { reset(); onClose(); }}
        confirmLabel="APRI FASE"
        confirmStyle={{ opacity: tipo ? 1 : 0.5, cursor: tipo ? "pointer" : "not-allowed" }}
      />
      <div style={{ display: "none" }}>
        <button type="button" disabled={!tipo} onClick={() => { onProceed(buildLottoId(lottoRaw), tipo); reset(); }} />
      </div>
    </ModalOverlay>
  );
}

// ── PreseminaPage ─────────────────────────────────────────────────────────
const FASI_OPTIONS = FASI_PRESEMINA.map((k) => ({ value: k, label: FASE_LABEL[k] }));

export default function PreseminaPage({ onBack }) {
  const { user, pass } = useAuth();

  // Which FaseModal is open + its lotto target
  const [activeFase, setActiveFase]   = useState(null); // "APPEZZAMENTO" | "ACQUISIZIONE_VARIETA" | "SEMINA"
  const [targetLotto, setTargetLotto] = useState("");
  const [faseSuffix, setFaseSuffix]   = useState("");

  // Recupera / Elimina / Modifica
  const [showRecupera, setShowRecupera] = useState(false);
  const [showElimina, setShowElimina]   = useState(false);
  const [showModifica, setShowModifica] = useState(false);
  const [faseViewerData, setFaseViewerData] = useState(null);
  const [showViewer, setShowViewer]     = useState(false);

  // Ask-lotto-id before opening a fase insert modal
  const [showAskLotto, setShowAskLotto] = useState(false);
  const [pendingFase, setPendingFase]   = useState(null);
  const [askLottoRaw, setAskLottoRaw]   = useState("");
  const [askLottoErr, setAskLottoErr]   = useState("");

  function openFase(faseKey) {
    setPendingFase(faseKey);
    setAskLottoRaw("");
    setAskLottoErr("");
    setShowAskLotto(true);
  }

  function handleAskLottoOk(e) {
    e.preventDefault();
    if (!askLottoRaw.trim()) { setAskLottoErr("Obbligatorio"); return; }
    setTargetLotto(buildLottoId(askLottoRaw));
    setFaseSuffix("");
    setActiveFase(pendingFase);
    setShowAskLotto(false);
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
      setShowRecupera(false);
      setShowViewer(true);
    } catch (err) { setMsg(extractApiError(err)); }
  }

  async function handleEliminaConfirm(lottoId, faseName, setMsg) {
    try {
      const res = await apiDeleteFase(user, pass, lottoId, faseName);
      setMsg(res?.message ? `OK: ${res.message}` : "OK: Fase eliminata");
    } catch (err) { setMsg(extractApiError(err)); }
  }

  // Config map for FaseModal
  const faseConfig = {
    APPEZZAMENTO:        { renderForm: AppezzamentoForm,        initialFields: AppezzamentoInitial,        buildPayload: buildAppezzamentoPayload,        title: "APPEZZAMENTO" },
    ACQUISIZIONE_VARIETA:{ renderForm: AcquisizioneVarietaForm, initialFields: AcquisizioneVarietaInitial, buildPayload: buildAcquisizioneVarietaPayload, title: "ACQUISIZIONE VARIETÀ" },
    SEMINA:              { renderForm: SeminaForm,              initialFields: SeminaInitial,              buildPayload: buildSeminaPayload,              title: "SEMINA" },
  };

  const cfg = activeFase ? faseConfig[activeFase] : null;

  return (
    <MacroPage title="PRESEMINA E SEMINA" onBack={onBack}
      onModifica={() => setShowModifica(true)}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <button style={bigFaseBtn} onClick={() => openFase("APPEZZAMENTO")}>APPEZZAMENTO</button>
        <button style={{ ...bigFaseBtn, opacity: 0.5, cursor: "not-allowed" }} disabled>LAVORAZIONI</button>
        <button style={bigFaseBtn} onClick={() => openFase("ACQUISIZIONE_VARIETA")}>ACQUISIZIONE VARIETÀ</button>
        <button style={bigFaseBtn} onClick={() => openFase("SEMINA")}>SEMINA</button>
      </div>

      {/* Recupera / Elimina fase */}
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

      {/* Ask lotto before inserting a fase */}
      {showAskLotto && (
        <ModalOverlay onClose={() => setShowAskLotto(false)}>
          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 14 }}>Inserisci ID lotto</div>
          <form onSubmit={handleAskLottoOk}>
            <LottoIdInput value={askLottoRaw} onChange={setAskLottoRaw} autoFocus />
            <ValidationMsg msg={askLottoErr} />
            <ModalButtons onCancel={() => setShowAskLotto(false)} confirmLabel="AVANTI" />
          </form>
        </ModalOverlay>
      )}

      {/* FaseModal — mounts only when a fase is active */}
      {cfg && (
        <FaseModal
          show={!!activeFase}
          onClose={() => setActiveFase(null)}
          title={cfg.title}
          lottoId={targetLotto}
          faseType={activeFase}
          renderForm={cfg.renderForm}
          buildPayload={cfg.buildPayload}
          initialFields={cfg.initialFields}
          suffix={faseSuffix}
          setSuffix={setFaseSuffix}
          onSuccess={() => setActiveFase(null)}
        />
      )}

      <FaseAskModal show={showRecupera} onClose={() => setShowRecupera(false)} mode="recupera" onConfirm={handleRecuperaConfirm} faseOptions={FASI_OPTIONS} />
      <FaseAskModal show={showElimina}  onClose={() => setShowElimina(false)}  mode="elimina"  onConfirm={handleEliminaConfirm}  faseOptions={FASI_OPTIONS} />
      <FaseViewerModal show={showViewer} onClose={() => setShowViewer(false)} data={faseViewerData} />
      <ModifyFaseModal show={showModifica} onClose={() => setShowModifica(false)}
        faseOptions={FASI_OPTIONS}
        onProceed={(lottoId, faseKey) => { setTargetLotto(lottoId); setFaseSuffix(""); setActiveFase(faseKey); setShowModifica(false); }}
      />
    </MacroPage>
  );
}