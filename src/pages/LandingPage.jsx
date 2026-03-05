import { BTN_OCRA, BTN_OCRA_DARK, BTN_YELLOW } from "../constants";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { buildLottoId, formatISOWithLocalOffset, extractApiError } from "../utils";
import { apiCreateLotto, apiUpdateLotto, apiDeleteLotto, apiGetLotto } from "../api";
import { ModalOverlay, ModalButtons, LottoIdInput, ValidationMsg, StatusMsg, KVTable, FasiTable } from "../components/UI";

// ── Sub-modals (all self-contained) ──────────────────────────────────────

function InsertLottoModal({ show, onClose }) {
  const { user, pass } = useAuth();
  const [idRaw, setIdRaw] = useState("");
  const [creator, setCreator] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  function reset() { setIdRaw(""); setCreator(""); setValidationMsg(""); setStatusMsg(""); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!idRaw.trim() || !creator.trim()) { setValidationMsg("Compilare tutti i campi richiesti"); return; }
    setValidationMsg(""); setLoading(true); setStatusMsg("");
    try {
      const fullId = buildLottoId(idRaw);
      await apiCreateLotto(user, pass, {
        dati_generali: { lotto: fullId, filiera: "Grano duro/Pasta", operatore_creazione: creator.trim(), timestamp_creazione: formatISOWithLocalOffset() },
      });
      setStatusMsg(`OK: Lotto ${fullId} inserito correttamente`);
    //   reset();
    } catch (err) { setStatusMsg(extractApiError(err)); }
    finally { setLoading(false); }
  }

  if (!show) return null;
  return (
    <ModalOverlay onClose={() => { reset(); onClose(); }}>
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 16 }}>Inserisci Lotto</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 13 }}>ID lotto</div>
          <LottoIdInput value={idRaw} onChange={setIdRaw} autoFocus />
          <div style={{ fontWeight: 800, fontSize: 13 }}>Nome creatore lotto</div>
          <input value={creator} onChange={(e) => setCreator(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box" }} />
        </div>
        <ValidationMsg msg={validationMsg} />
        <ModalButtons onCancel={() => { reset(); onClose(); }} loading={loading} confirmLabel="CREA" />
      </form>
      <StatusMsg msg={statusMsg} />
    </ModalOverlay>
  );
}

function EditLottoModal({ show, onClose }) {
  const { user, pass } = useAuth();
  const [idRaw, setIdRaw] = useState("");
  const [creator, setCreator] = useState("");
  const [resolvedId, setResolvedId] = useState(null); // null = not yet fetched
  const [loading, setLoading] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  function reset() { setIdRaw(""); setCreator(""); setResolvedId(null); setValidationMsg(""); setStatusMsg(""); }

  async function handleFetch(e) {
    e.preventDefault();
    if (!idRaw.trim()) { setValidationMsg("Compilare tutti i campi richiesti"); return; }
    setValidationMsg(""); setLoading(true); setStatusMsg("");
    try {
      const fullId = buildLottoId(idRaw);
      const data = await apiGetLotto(user, pass, fullId);
      const dg = data?.dati_generali || {};
      setResolvedId(buildLottoId(String(dg.lotto || fullId)));
      setCreator(String(dg.operatore_creazione || ""));
    } catch (err) { setStatusMsg(extractApiError(err)); }
    finally { setLoading(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!creator.trim()) { setValidationMsg("Compilare tutti i campi richiesti"); return; }
    setValidationMsg(""); setLoading(true); setStatusMsg("");
    try {
      await apiUpdateLotto(user, pass, resolvedId, {
        dati_generali: { lotto: resolvedId, filiera: "Grano duro/Pasta", operatore_creazione: creator.trim(), timestamp_creazione: formatISOWithLocalOffset() },
      });
      setStatusMsg(`OK: Lotto ${resolvedId} modificato correttamente`);
    } catch (err) { setStatusMsg(extractApiError(err)); }
    finally { setLoading(false); }
  }

  if (!show) return null;
  return (
    <ModalOverlay onClose={() => { reset(); onClose(); }}>
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 16 }}>Modifica Lotto</div>
      {!resolvedId ? (
        <form onSubmit={handleFetch}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>ID lotto da modificare</div>
          <LottoIdInput value={idRaw} onChange={setIdRaw} autoFocus />
          <ValidationMsg msg={validationMsg} />
          <ModalButtons onCancel={() => { reset(); onClose(); }} loading={loading} confirmLabel={loading ? "Caricamento..." : "CERCA"} />
        </form>
      ) : (
        <form onSubmit={handleUpdate}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>ID lotto</div>
            <input value={resolvedId} readOnly
              style={{ width: "100%", padding: 14, borderRadius: 12, border: "2px solid #ccc", background: "#f2f2f2", boxSizing: "border-box", fontWeight: 900, fontSize: 26, textAlign: "center", color: "#111" }} />
            <div style={{ fontWeight: 800, fontSize: 13 }}>Nome creatore lotto</div>
            <input value={creator} onChange={(e) => setCreator(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box" }} />
          </div>
          <ValidationMsg msg={validationMsg} />
          <ModalButtons onCancel={() => { reset(); onClose(); }} loading={loading} confirmLabel="MODIFICA" />
        </form>
      )}
      <StatusMsg msg={statusMsg} />
    </ModalOverlay>
  );
}

function RecuperaLottoModal({ show, onClose }) {
  const { user, pass } = useAuth();
  const [idRaw, setIdRaw] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  function reset() { setIdRaw(""); setData(null); setValidationMsg(""); setStatusMsg(""); }

  async function handleFetch(e) {
    e.preventDefault();
    if (!idRaw.trim()) { setValidationMsg("Compilare tutti i campi richiesti"); return; }
    setValidationMsg(""); setLoading(true); setStatusMsg("");
    try {
      const fullId = buildLottoId(idRaw);
      const root = await apiGetLotto(user, pass, fullId);
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
      setData(normalized)
    //   setData({ ...lottoObj, dati_generali: lottoObj?.dati_generali || {}, fasi: Array.isArray(lottoObj?.fasi) ? lottoObj.fasi : [], __id: fullId });
    } catch (err) { setStatusMsg(extractApiError(err)); }
    finally { setLoading(false); }
  }

  if (!show) return null;
  return (
    <ModalOverlay onClose={() => { reset(); onClose(); }} maxWidth={860}>
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 16 }}>Recupera Info Lotto</div>
      {!data ? (
        <form onSubmit={handleFetch}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>ID lotto da recuperare</div>
          <LottoIdInput value={idRaw} onChange={setIdRaw} autoFocus />
          <ValidationMsg msg={validationMsg} />
          <ModalButtons onCancel={() => { reset(); onClose(); }} loading={loading} confirmLabel={loading ? "Caricamento..." : "CERCA"} />
        </form>
      ) : (
        <>
          <div style={{ textAlign: "center", fontWeight: 1000, fontSize: 24, marginBottom: 16 }}>{data.__id}</div>
          <KVTable title="Dati generali" data={data.dati_generali} />
          {/* <div style={{ border: "1px solid #eee", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}> */}
            {/* <div style={{ padding: 12, background: "#f6f7fb", fontWeight: 1000, fontSize: 15 }}>Fasi</div> */}
            <div style={{ padding: 12, color: data.fasi.length === 0 ? "#999" : "#111", fontWeight: 700 }}>
              {data.fasi.length === 0 ? "Nessuna fase presente." : <FasiTable title="Fasi" data={data.fasi}/>}

            </div>
          {/* </div> */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <button onClick={() => setData(null)} type="button"
              style={{ padding: "10px 24px", borderRadius: 12, border: "1px solid #ddd", background: "white", fontWeight: 800, cursor: "pointer" }}>
              ← Cerca altro
            </button>
            <button onClick={() => { reset(); onClose(); }} type="button"
              style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "#111", color: "white", fontWeight: 900, cursor: "pointer" }}>
              CHIUDI
            </button>
          </div>
        </>
      )}
      <StatusMsg msg={statusMsg} />
    </ModalOverlay>
  );
}

function DeleteLottoModal({ show, onClose }) {
  const { user, pass } = useAuth();
  const [idRaw, setIdRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  function reset() { setIdRaw(""); setValidationMsg(""); setStatusMsg(""); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!idRaw.trim()) { setValidationMsg("Compilare tutti i campi richiesti"); return; }
    setValidationMsg(""); setLoading(true); setStatusMsg("");
    try {
      const res = await apiDeleteLotto(user, pass, buildLottoId(idRaw));
      setStatusMsg(res?.message ? `OK: ${res.message}` : "OK: Lotto eliminato");
    } catch (err) { setStatusMsg(extractApiError(err)); }
    finally { setLoading(false); }
  }

  if (!show) return null;
  return (
    <ModalOverlay onClose={() => { reset(); onClose(); }}>
      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 16 }}>Elimina Lotto</div>
      <form onSubmit={handleSubmit}>
        <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>ID lotto da eliminare</div>
        <LottoIdInput value={idRaw} onChange={setIdRaw} autoFocus />
        <ValidationMsg msg={validationMsg} />
        <ModalButtons
          onCancel={() => { reset(); onClose(); }} loading={loading}
          confirmLabel={loading ? "Eliminazione..." : "ELIMINA"}
          confirmStyle={{ background: "#B03A2E" }}
        />
      </form>
      <StatusMsg msg={statusMsg} />
    </ModalOverlay>
  );
}

// ── LandingPage ───────────────────────────────────────────────────────────
export default function LandingPage({ onGo }) {
  const [showInsert, setShowInsert]   = useState(false);
  const [showEdit, setShowEdit]       = useState(false);
  const [showRecupera, setShowRecupera] = useState(false);
  const [showDelete, setShowDelete]   = useState(false);

  const bigBtn = { height: 150, borderRadius: 22, border: "none", fontWeight: 800, fontSize: 40, cursor: "pointer", background: BTN_OCRA, color: "#111", boxShadow: "0 10px 25px rgba(0,0,0,0.10)" };
  const faseBtn = { width: "100%", fontWeight: 800, padding: "36px 28px", borderRadius: 22, border: "none", background: BTN_YELLOW, color: "#000", fontFamily: "Lato, system-ui, sans-serif", cursor: "pointer", textAlign: "left", boxShadow: "0 14px 35px rgba(0,0,0,0.15)" };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", fontFamily: "Lato, system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 60, fontWeight: 1000, margin: 0, lineHeight: 1.15 }}>
          BLOCKCHAIN FILIERA<br />GRANO DURO/PASTA
        </h1>
        <div style={{ marginTop: 12, fontSize: 22, color: "#555", maxWidth: 900 }}>
          Sistema digitale per la registrazione, consultazione e verifica<br />
          della merce tracciata e delle diverse fasi della filiera agroalimentare
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 1300, display: "flex", gap: 48, justifyContent: "center", marginBottom: 32 }}>
        <button style={{ ...bigBtn, width: 640 }} onClick={() => setShowInsert(true)}>INSERISCI LOTTO</button>
        <button style={{ ...bigBtn, width: 640 }} onClick={() => setShowEdit(true)}>MODIFICA LOTTO</button>
      </div>

      <div style={{ width: "100%", maxWidth: 900, display: "grid", gap: 28 }}>
{[
  { key: "presemina",  label: "PRESEMINA E SEMINA", description:"Origine certificata e identità varietale! All'interno di questa sezione troverai lo spazio per inserire dati indispensabili per identificare l'origine delle materie prime. Quanto inserirai consentirà di verificare la coerenza tra impegni contrattuali, superfici coltivate e varietà dichiarate, costruendo l'identità digitale del lotto fin dall'origine. Meno carte più certezze!" },
  { key: "raccolta",   label: "RACCOLTA E CONSEGNA AL SILOS", description:"Qualità misurata, tracciabilità garantita! All'interno di questa sezione troverai lo spazio per registrare e consultare tutti i dati legati alla raccolta, al trasporto e al conferimento del grano presso il centro di stoccaggio. Ogni carico sarà collegato all'appezzamento di origine e ogni scarico sarà associato ai parametri qualitativi rilevati in ingresso (proteine, umidità, peso specifico), oltre alla destinazione in silos. Quanto inserirai permetterà di monitorare in modo oggettivo qualità, provenienza e integrità varietale lungo tutta la fase operativa. Meno dubbi, più sicurezze!" },
  { key: "stoccaggio", label: "STOCCAGGIO E CONSEGNA A SEMOLIERE", description:"Lotto certificato, conformità verificata! All'interno di questa sezione troverai lo spazio per costruire e validare i lotti destinati a molino o industria, con volumi, caratteristiche qualitative e programmazione delle consegne. Ogni trasporto sarà collegato a un lotto univoco e ogni consegna sarà accompagnata da analisi qualitative e verifica varietale, consentendo il confronto diretto con i parametri contrattuali. Quanto inserirai renderà immediata la verifica di conformità e ridurrà il rischio di contestazioni. Meno contestazioni, più valore al tuo grano!" },
].map(({ key, label, description }) => {
  const bangIndex = description.indexOf("!");
  const cursivePart = description.substring(0, bangIndex + 1);
  const normalPart = description.substring(bangIndex + 1);

  return (
    <button key={key} style={faseBtn} onClick={() => onGo(key)}>
      <div style={{ fontSize: 42, fontWeight: 700, marginBottom: 6, textAlign: "center" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, opacity: 0.85 }}>
        <span style={{ fontStyle: "italic", fontFamily: "Georgia, 'Times New Roman', serif" }}>{cursivePart}</span><br/>
        {normalPart}
      </div>
    </button>
  );
})}
      </div>

      <div style={{ width: "100%", maxWidth: 900, marginTop: 32 }}>
        <button onClick={() => setShowRecupera(true)}
          style={{ width: "100%", height: 70, borderRadius: 16, border: "none", fontWeight: 800, fontSize: 28, cursor: "pointer", background: BTN_OCRA_DARK, color: "white" }}>
          Recupera Info Lotto
        </button>
      </div>
      <div style={{ width: "100%", maxWidth: 900, marginTop: 24, display: "flex", justifyContent: "center" }}>
        <button onClick={() => setShowDelete(true)}
          style={{ height: 100, width: "75%", borderRadius: 16, border: "none", fontWeight: 800, fontSize: 34, cursor: "pointer", background: "linear-gradient(135deg, #A67C00 0%, #B03A2E 100%)", color: "white" }}>
          ELIMINA LOTTO
        </button>
      </div>

      <InsertLottoModal   show={showInsert}   onClose={() => setShowInsert(false)} />
      <EditLottoModal     show={showEdit}     onClose={() => setShowEdit(false)} />
      <RecuperaLottoModal show={showRecupera} onClose={() => setShowRecupera(false)} />
      <DeleteLottoModal   show={showDelete}   onClose={() => setShowDelete(false)} />
    </div>
  );
}