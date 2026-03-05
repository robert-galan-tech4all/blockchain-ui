import { Field, TextArea } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

// Fields rendered inside FaseModal
export function AppezzamentoForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <Field required={true} label="Nome operatore *" value={fields.operatore || ""} onChange={set("operatore")} />
      <Field required={true} label="Codice appezzamento *" value={fields.codice_appezzamento || ""} onChange={set("codice_appezzamento")} />
      <Field required={true} label="Superficie (ha) *" value={fields.superficie_ha || ""} onChange={set("superficie_ha")} type="number" />
      <Field required={true} label="Indirizzo / Località *" value={fields.indirizzo || ""} onChange={set("indirizzo")} />
      <Field required={true} label="Comune *" value={fields.comune || ""} onChange={set("comune")} />
      <TextArea label="Altre info (opzionale)" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

// Initial empty fields
export const AppezzamentoInitial = {
  operatore: "", codice_appezzamento: "", superficie_ha: "",
  indirizzo: "", comune: "", altre_info: "",
};

// Builds { nome, dettagli } payload — returns null if validation fails
export function buildAppezzamentoPayload(fields, faseType, suffix) {
  const { operatore, codice_appezzamento, superficie_ha, indirizzo, comune } = fields;
  if (!operatore || !codice_appezzamento || !superficie_ha || !indirizzo || !comune || !suffix?.trim()) return null;
  const prefix = `presemina_appezzamento-`;
  return {
    nome: `${prefix}${suffix.trim()}`,
    dettagli: {
      operatore, codice_appezzamento,
      superficie_ha, indirizzo, comune,
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}