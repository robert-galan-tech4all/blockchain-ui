import { Field, TextArea, SectionTitle } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

export function ScaricoForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <Field required={true} label="Operatore *" value={fields.operatore || ""} onChange={set("operatore")} />
      <Field required={true} label="Peso scaricato *" value={fields.peso_scaricato || ""} onChange={set("peso_scaricato")} type="number" />
      <SectionTitle>Qualità</SectionTitle>
      <Field required={true} label="Proteine (%) *" value={fields.proteine || ""} onChange={set("proteine")} type="number" hint="Es: 12.5" />
      <Field required={true} label="Peso specifico (0–100) *" value={fields.peso_specifico || ""} onChange={set("peso_specifico")} type="number" />
      <Field required={true} label="Umidità (%) *" value={fields.umidita || ""} onChange={set("umidita")} type="number" />
      <Field required={true} label="Difettosità *" value={fields.difettosita || ""} onChange={set("difettosita")} />
      <Field required={true} label="Impurità *" value={fields.impurita || ""} onChange={set("impurita")} />
      <TextArea label="Altre info (opzionale)" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

export const ScaricoInitial = {
  operatore: "", peso_scaricato: "",
  proteine: "", peso_specifico: "", umidita: "", difettosita: "", impurita: "",
  altre_info: "",
};

export function buildScaricoPayload(fields, faseType, suffix) {
  const { operatore, peso_scaricato, proteine, peso_specifico, umidita, difettosita, impurita } = fields;
  if (!operatore || !peso_scaricato || !proteine || !peso_specifico || !umidita || !difettosita || !impurita || !suffix?.trim()) return null;
  return {
    nome: `raccolta_scarico-${suffix.trim()}`,
    dettagli: {
      operatore, peso_scaricato,
      qualita: { proteine, peso_specifico, umidita, difettosita, impurita },
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}