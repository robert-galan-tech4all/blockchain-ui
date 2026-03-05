import { Field, UnitQtyInput, TextArea, SectionTitle } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

export function ConsegnaForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <Field required={true} label="Operatore *" value={fields.operatore || ""} onChange={set("operatore")} />
      <UnitQtyInput
      required={true}
        label="Peso *"
        qty={fields.peso || ""}     onQtyChange={set("peso")}
        unit={fields.unita || "kg"} onUnitChange={set("unita")}
      />
      <SectionTitle>Qualità</SectionTitle>
      <Field required={true} label="Proteine (%) *" value={fields.proteine || ""} onChange={set("proteine")} type="number" />
      <Field required={true} label="Peso specifico (0–100) *" value={fields.peso_specifico || ""} onChange={set("peso_specifico")} type="number" />
      <Field required={true} label="Umidità (%) *" value={fields.umidita || ""} onChange={set("umidita")} type="number" />
      <Field required={true} label="Difettosità *" value={fields.difettosita || ""} onChange={set("difettosita")} />
      <Field required={true} label="Impurità *" value={fields.impurita || ""} onChange={set("impurita")} />
      <TextArea label="Analisi varietale (opzionale)" value={fields.analisi_varietale || ""} onChange={set("analisi_varietale")} />
      <TextArea label="Altre info" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

export const ConsegnaInitial = {
  operatore: "", peso: "", unita: "kg",
  proteine: "", peso_specifico: "", umidita: "", difettosita: "", impurita: "",
  analisi_varietale: "", altre_info: "",
};

export function buildConsegnaPayload(fields, faseType, suffix) {
  const { operatore, peso, proteine, peso_specifico, umidita, difettosita, impurita } = fields;
  if (!operatore || !peso || !proteine || !peso_specifico || !umidita || !difettosita || !impurita || !suffix?.trim()) return null;
  return {
    nome: `stoccaggio_consegna-${suffix.trim()}`,
    dettagli: {
      operatore,
      peso: `${peso} ${fields.unita}`,
      qualita: { proteine, peso_specifico, umidita, difettosita, impurita },
      analisi_varietale: fields.analisi_varietale || "",
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}