import { Field, UnitQtyInput, TextArea } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

export function TrasportoRaccoltaForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <Field required={true} label="Operatore *" value={fields.operatore || ""} onChange={set("operatore")} />
      <Field required={true} label="Luogo di carico *" value={fields.luogo_carico || ""} onChange={set("luogo_carico")} />
      <Field required={true} label="Luogo di scarico *" value={fields.luogo_scarico || ""} onChange={set("luogo_scarico")} />
      <UnitQtyInput
      required={true}
        label="Quantità totale delle trebbie *"
        qty={fields.quantita || ""} onQtyChange={set("quantita")}
        unit={fields.unita || "kg"}  onUnitChange={set("unita")}
      />
      <Field required={true} label="Km percorsi *" value={fields.km_percorsi || ""} onChange={set("km_percorsi")} type="number" />
      <Field required={true} label="Data di scarico *" value={fields.data_scarico || ""} onChange={set("data_scarico")} type="date" />
      <Field required={true} label="Numero trebbie *" value={fields.numero_trebbie || ""} onChange={set("numero_trebbie")} type="number" />
      <Field required={true} label="Nomi trebbie *" value={fields.nomi_trebbie || ""} onChange={set("nomi_trebbie")} hint="Separare con virgola se più di una" />
      <TextArea label="Altre info (opzionale)" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

export const TrasportoRaccoltaInitial = {
  operatore: "", luogo_carico: "", luogo_scarico: "", quantita: "",
  unita: "kg", km_percorsi: "", data_scarico: "",
  numero_trebbie: "", nomi_trebbie: "", altre_info: "",
};

export function buildTrasportoRaccoltaPayload(fields, faseType, suffix) {
  const { operatore, luogo_carico, luogo_scarico, quantita, km_percorsi, data_scarico, numero_trebbie, nomi_trebbie } = fields;
  if (!operatore || !luogo_carico || !luogo_scarico || !quantita || !km_percorsi || !data_scarico || !numero_trebbie || !nomi_trebbie || !suffix?.trim()) return null;
  return {
    nome: `raccolta_trasporto-${suffix.trim()}`,
    dettagli: {
      operatore, luogo_carico, luogo_scarico,
      quantita: `${quantita} ${fields.unita}`,
      km_percorsi, data_scarico, numero_trebbie,
      nomi_trebbie,
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}