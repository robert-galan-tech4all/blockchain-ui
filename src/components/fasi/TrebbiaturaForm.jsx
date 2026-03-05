import { useState, useEffect } from "react";
import { Select, UnitQtyInput, TextArea, Field } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";
import { apiGetLotti, apiGetLottoFasi } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { FASE_PREFIX } from "../../constants";

export function TrebbiaturaForm(fields, setFields) {
  const { user, pass } = useAuth();
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));

  const [lotti, setLotti] = useState([]);
  const [loadingLotti, setLoadingLotti] = useState(false);
  const [lottiError, setLottiError] = useState("");

  const [appezzamenti, setAppezzamenti] = useState([]);
  const [loadingAppezzamenti, setLoadingAppezzamenti] = useState(false);
  const [appezzamentiError, setAppezzamentiError] = useState("");

  // Fetch all lotti on mount
  useEffect(() => {
    setLoadingLotti(true);
    setLottiError("");
    apiGetLotti(user, pass)
      .then((data) => {
        // Response shape: { status, message, result: [ { lotto_id, dati_generali, fasi }, ... ] }
        const arr = Array.isArray(data?.result) ? data.result : [];
        setLotti(
          arr.map((l) => ({
            value: l.lotto_id,
            label: l.lotto_id,
          }))
        );
      })
      .catch(() => setLottiError("Impossibile caricare i lotti"))
      .finally(() => setLoadingLotti(false));
  }, []);

  // When selected lotto changes, extract its appezzamenti from the already-fetched result
  // (no second API call needed — fasi are embedded in the lotti response)
  useEffect(() => {
    if (!fields.lotto_selezionato) {
      setAppezzamenti([]);
      return;
    }

    setLoadingAppezzamenti(true);
    setAppezzamentiError("");
    setFields((f) => ({ ...f, nome_appezzamento: "" }));

    apiGetLotti(user, pass)
      .then((data) => {
        const arr = Array.isArray(data?.result) ? data.result : [];
        const lotto = arr.find((l) => l.lotto_id === fields.lotto_selezionato);
        const fasi = Array.isArray(lotto?.fasi) ? lotto.fasi : [];

        const appPrefix = FASE_PREFIX.APPEZZAMENTO; // "presemina_appezzamento-"
        const opts = fasi
          .filter((f) => f?.nome?.startsWith(appPrefix))
          .map((f) => ({ value: f.nome, label: f.nome }));

        setAppezzamenti(opts);
        if (opts.length === 0)
          setAppezzamentiError("Nessun appezzamento trovato per questo lotto");
        else
          setAppezzamentiError("");
      })
      .catch(() => setAppezzamentiError("Impossibile caricare gli appezzamenti"))
      .finally(() => setLoadingAppezzamenti(false));
  }, [fields.lotto_selezionato]);

  return (
    <>
      <Select
        label={loadingLotti ? "Lotto (caricamento...)" : "Lotto *"}
        value={fields.lotto_selezionato || ""}
        onChange={set("lotto_selezionato")}
        options={lotti}
        disabled={loadingLotti}
      />
      {lottiError && (
        <div style={{ fontSize: 12, color: "#b00020", fontWeight: 700 }}>{lottiError}</div>
      )}

      {fields.lotto_selezionato && (
        <>
          <Select
            label={
              loadingAppezzamenti
                ? "Nome appezzamento (caricamento...)"
                : appezzamenti.length === 0
                ? "Nome appezzamento (nessuno trovato)"
                : "Nome appezzamento *"
            }
            value={fields.nome_appezzamento || ""}
            onChange={set("nome_appezzamento")}
            options={appezzamenti}
            disabled={loadingAppezzamenti || appezzamenti.length === 0}
          />
          {appezzamentiError && (
            <div style={{ fontSize: 12, color: "#b00020", fontWeight: 700 }}>
              {appezzamentiError}
            </div>
          )}
        </>
      )}

      <Field
      required={true}
        label="Operatore *"
        value={fields.operatore || ""}
        onChange={set("operatore")}
      />
      <UnitQtyInput
      required={true}
        label="Quantità *"
        qty={fields.quantita || ""}
        onQtyChange={set("quantita")}
        unit={fields.unita || "kg"}
        onUnitChange={set("unita")}
      />
      <TextArea
        label="Altre info (opzionale)"
        value={fields.altre_info || ""}
        onChange={set("altre_info")}
      />
    </>
  );
}

export const TrebbiaturaInitial = {
  lotto_selezionato: "",
  nome_appezzamento: "",
  operatore: "",
  quantita: "",
  unita: "kg",
  altre_info: "",
};

export function buildTrebbiaturaPayload(fields, faseType, suffix) {
  const { nome_appezzamento, operatore, quantita, unita } = fields;
  if (!nome_appezzamento || !operatore || !quantita || !suffix?.trim()) return null;
  return {
    nome: `raccolta_trebbiatura-${suffix.trim()}`,
    dettagli: {
      nome_appezzamento,
      operatore,
      quantita: `${quantita} ${unita}`,
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}