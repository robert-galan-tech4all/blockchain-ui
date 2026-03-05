import { Field, UnitQtyInput, TextArea } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

export function AcquisizioneVarietaForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <Field required={true} label="Operatore *" value={fields.operatore || ""} onChange={set("operatore")} />
      <Field required={true} label="Nome commerciale *" value={fields.nome_commerciale || ""} onChange={set("nome_commerciale")} />
      <UnitQtyInput
        required={true}
        label="Quantità *"
        qty={fields.quantita || ""} onQtyChange={set("quantita")}
        unit={fields.unita || "kg"}  onUnitChange={set("unita")}
      />
      <Field required={true} label="Prezzo di acquisto *" value={fields.prezzo_acquisto || ""} onChange={set("prezzo_acquisto")} type="number" />
      <TextArea label="Altre info (opzionale)" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

export const AcquisizioneVarietaInitial = {
  operatore: "", nome_commerciale: "", quantita: "", unita: "kg",
  prezzo_acquisto: "", altre_info: "",
};

export function buildAcquisizioneVarietaPayload(fields, faseType, suffix) {
  const { operatore, nome_commerciale, quantita, unita, prezzo_acquisto } = fields;
  if (!operatore || !nome_commerciale || !quantita || !prezzo_acquisto || !suffix?.trim()) return null;
  return {
    nome: `presemina_acquisizionevarieta-${suffix.trim()}`,
    dettagli: {
      operatore, nome_commerciale,
      quantita: `${quantita} ${unita}`,
      prezzo_acquisto,
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}