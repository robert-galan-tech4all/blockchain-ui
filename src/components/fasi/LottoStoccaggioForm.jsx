import { YesNoRadio, TextArea } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

export function LottoStoccaggioForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <YesNoRadio
        label="Conferma concordanza *"
        value={fields.conferma_concordanza || ""}
        onChange={set("conferma_concordanza")}
        name="stoccaggio_concordanza"
      />
      <TextArea label="Altre info (opzionale)" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

export const LottoStoccaggioInitial = {
  operatore: "", conferma_concordanza: "", altre_info: "",
};

export function buildLottoStoccaggioPayload(fields, faseType, suffix) {
  if (!fields.conferma_concordanza || !suffix?.trim()) return null;
  return {
    nome: `stoccaggio_lotto-${suffix.trim()}`,
    dettagli: {
      conferma_concordanza: fields.conferma_concordanza,
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}