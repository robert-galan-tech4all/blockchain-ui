/**
 * Auto-detect: FaseModal will GET the fase first and merge coppie_carico.
 * This form only collects ONE new pair (data_carico + quantita).
 */
import { Field, UnitQtyInput, TextArea, SectionTitle } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

export function TrasportoStoccaggioForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <Field required={true} label="Operatore *" value={fields.operatore || ""} onChange={set("operatore")} />
      <Field required={true} label="Luogo di partenza *" value={fields.luogo_partenza || ""} onChange={set("luogo_partenza")} />
      <Field required={true} label="Luogo di consegna *" value={fields.luogo_consegna || ""} onChange={set("luogo_consegna")} />
      <SectionTitle>Nuova coppia carico</SectionTitle>
      <Field required={true} label="Data carico *" value={fields.data_carico || ""} onChange={set("data_carico")} type="date" />
      <UnitQtyInput
        equired={true}
        label="Quantità caricata *"
        qty={fields.quantita_carico || ""} onQtyChange={set("quantita_carico")}
        unit={fields.unita || "kg"}        onUnitChange={set("unita")}
      />
      <TextArea label="Altre info (opzionale)" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

export const TrasportoStoccaggioInitial = {
  operatore: "", luogo_partenza: "", luogo_consegna: "",
  data_carico: "", quantita_carico: "", unita: "kg", altre_info: "",
};

export function buildTrasportoStoccaggioPayload(fields, faseType, suffix) {
  const { operatore, luogo_partenza, luogo_consegna, data_carico, quantita_carico } = fields;
  if (!operatore || !luogo_partenza || !luogo_consegna || !data_carico || !quantita_carico || !suffix?.trim()) return null;
  return {
    nome: `stoccaggio_trasporto-${suffix.trim()}`,
    dettagli: {
      operatore,
      luogo_partenza,
      luogo_consegna,
      // FaseModal merges this into the existing array if fase already exists
      coppie_carico: [{ data_carico, quantita: `${quantita_carico} ${fields.unita}` }],
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}