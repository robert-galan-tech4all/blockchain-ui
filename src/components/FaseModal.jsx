/**
 * FaseModal — shared shell for inserting any fase.
 *
 * Props:
 *   show        – boolean
 *   onClose     – () => void
 *   title       – string   e.g. "APPEZZAMENTO"
 *   lottoId     – string   e.g. "GD-123"  (already resolved)
 *   faseType    – string   key from FASE_PREFIX
 *   onSuccess   – (faseName) => void  called after successful POST/PUT
 *   renderForm  – (fields, setFields, extraProps) => JSX
 *                 The inner form component renders only fields.
 *   buildPayload – (fields, faseType, suffix) => { nome, dettagli }
 *   initialFields – object  initial state for the form fields
 *   suffix      – string   the ID suffix part of the fase name
 *   setSuffix   – fn
 *   prefixLabel – string   e.g. "presemina_appezzamento-"
 *   extraProps  – any extra data the inner form needs (e.g. appezzamenti list)
 */

import { useState } from "react";
import { ModalOverlay, ModalButtons, ValidationMsg, StatusMsg } from "./UI";
import { FASE_PREFIX } from "../constants";
import { apiCreateFase, apiUpdateFase, apiGetFase } from "../api";
import { useAuth } from "../hooks/useAuth";

export default function FaseModal({
  show,
  onClose,
  title,
  lottoId,
  faseType,
  onSuccess,
  renderForm,
  buildPayload,
  initialFields,
  suffix,
  setSuffix,
  extraProps = {},
}) {
  const { user, pass } = useAuth();
  const [fields, setFields] = useState(initialFields || {});
  const [loading, setLoading] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const prefix = FASE_PREFIX[faseType] || "";
  const faseName = `${prefix}${(suffix || "").trim()}`;

  function handleClose() {
    setFields(initialFields || {});
    setSuffix?.("");
    setValidationMsg("");
    setStatusMsg("");
    onClose();
  }

async function handleSubmit(e) {
  e.preventDefault();
  setValidationMsg("");
  setStatusMsg("");

  const payload = buildPayload(fields, faseType, suffix);
  if (!payload) {
    setValidationMsg("Compilare tutti i campi obbligatori");
    return;
  }

  setLoading(true);
  try {
    // For TRASPORTO_STOCCAGGIO: auto-detect if fase exists, then PUT to append pair
    if (faseType === "TRASPORTO_STOCCAGGIO") {
      let existing = null;
      try {
        existing = await apiGetFase(user, pass, lottoId, faseName);
        console.log('API Response:', existing);
      } catch (error) {
        console.log('Fase non trovata (404 expected):', error);
        existing = null; // 404 = not found, proceed with POST
      }
      
      if (existing && existing.result) {  // Verifica che existing e existing.result esistano
        // Estrai i dettagli dalla risposta
        const existingResult = existing.result;
        const existingDettagli = existingResult.dettagli || {};
        const existingCoppie = Array.isArray(existingDettagli.coppie_carico) ? existingDettagli.coppie_carico : [];
        
        // La nuova coppia da aggiungere
        const newCoppia = payload.dettagli?.coppie_carico?.[0];
        
        if (!newCoppia) {
          setValidationMsg("Dati della coppia di carico non validi");
          setLoading(false);
          return;
        }

        // Costruisci il payload aggiornato
        const mergedPayload = {
          ...payload,
          dettagli: {
            ...existingDettagli,
            ...payload.dettagli,
            coppie_carico: [...existingCoppie, newCoppia],  // Aggiungi la nuova coppia
          },
        };
        
        console.log('Merged Payload:', mergedPayload);
        await apiUpdateFase(user, pass, lottoId, faseName, mergedPayload);
      } else {
        console.log('Creating new fase with payload:', payload);
        await apiCreateFase(user, pass, lottoId, payload);
      }
    } else {
      await apiCreateFase(user, pass, lottoId, payload);
    }

    setStatusMsg(`OK: fase "${faseName}" salvata nel lotto ${lottoId}`);
    onSuccess?.(faseName);
  } catch (err) {
    console.error('Errore durante il salvataggio:', err);
    const msg = err?.response?.status === 401 ? "401: Credenziali non valide"
      : err?.response?.status === 404 ? "Lotto non trovato"
      : err?.response?.data?.message ? String(err.response.data.message)
      : err?.message || "Errore di rete o server";
    setStatusMsg(msg);
  } finally {
    setLoading(false);
  }
}

  if (!show) return null;

  return (
    <ModalOverlay onClose={handleClose} maxWidth={760}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#888", textTransform: "uppercase" }}>
          Inserisci Fase
        </div>
        <div style={{ fontSize: 24, fontWeight: 1000, marginTop: 2 }}>{title}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginTop: 2 }}>
          Lotto: <span style={{ color: "#111" }}>{lottoId}</span>
        </div>
      </div>

      {/* Fase name / suffix row */}
      <div style={{ marginTop: 14, marginBottom: 18 }}>
        <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>Nome fase *</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={prefix} readOnly
            style={{ flex: 2, padding: 10, borderRadius: 10, border: "1px solid #ddd", background: "#f2f2f2", fontWeight: 800, textAlign: "center", fontSize: 12 }} />
          <input required={true} value={suffix || ""} onChange={(e) => setSuffix?.(e.target.value)} placeholder="ID fase"
            style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd", fontWeight: 700 }} />
        </div>
        {faseName !== prefix && (
          <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>
            Nome completo: <strong>{faseName}</strong>
          </div>
        )}
      </div>

      {/* Inner form fields rendered by each fase component */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: 14 }}>
          {renderForm(fields, setFields, extraProps)}
        </div>

        <ValidationMsg msg={validationMsg} />
        <ModalButtons onCancel={handleClose} loading={loading} confirmLabel="INSERISCI FASE" />
      </form>

      <StatusMsg msg={statusMsg} />
    </ModalOverlay>
  );
}