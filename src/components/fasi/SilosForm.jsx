import { YesNoRadio, TextArea } from "../UI";
import { formatISOWithLocalOffset } from "../../utils";

export function SilosForm(fields, setFields) {
  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));
  return (
    <>
      <YesNoRadio
      required={true}
        label="Silos esclusivo *"
        value={fields.silos_esclusivo || ""}
        onChange={set("silos_esclusivo")}
        name="silos_esclusivo"
      />
      <TextArea label="Altre info (opzionale)" value={fields.altre_info || ""} onChange={set("altre_info")} />
    </>
  );
}

export const SilosInitial = { silos_esclusivo: "", altre_info: "" };

export function buildSilosPayload(fields, faseType, suffix) {
  if (!fields.silos_esclusivo || !suffix?.trim()) return null;
  return {
    nome: `raccolta_silos-${suffix.trim()}`,
    dettagli: {
      silos_esclusivo: fields.silos_esclusivo,
      altre_info: fields.altre_info || "",
      timestamp_fase: formatISOWithLocalOffset(),
    },
  };
}