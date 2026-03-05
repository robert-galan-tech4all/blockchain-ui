import { Field, YesNoRadio, TextArea } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

export function SeminaForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <Field required={true} label="Operatore *" value={fields.operatore || ""} onChange={set("operatore")} />
      <YesNoRadio
      required={true}
        label="Conferma ettari seminati *"
        value={fields.conferma_ettari || ""}
        onChange={set("conferma_ettari")}
        name="semina_conferma"
      />
      {fields.conferma_ettari === "NO" && (
        <Field required={true} label="Numero ettari seminati *" value={fields.ettari_seminati || ""} onChange={set("ettari_seminati")} type="number" />
      )}
      <Field required={true} label="Data di fine semina *" value={fields.data_fine_semina || ""} onChange={set("data_fine_semina")} type="date" />
      <TextArea label="Altre info (opzionale)" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

export const SeminaInitial = {
  operatore: "", conferma_ettari: "", ettari_seminati: "",
  data_fine_semina: "", altre_info: "",
};

export function buildSeminaPayload(fields, faseType, suffix) {
  const { operatore, conferma_ettari, data_fine_semina } = fields;
  if (!operatore || !conferma_ettari || !data_fine_semina || !suffix?.trim()) return null;
  if (conferma_ettari === "NO" && !fields.ettari_seminati) return null;
  return {
    nome: `presemina_semina-${suffix.trim()}`,
    dettagli: {
      operatore, conferma_ettari,
      ettari_seminati: conferma_ettari === "NO" ? fields.ettari_seminati : "confermati",
      data_fine_semina,
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}