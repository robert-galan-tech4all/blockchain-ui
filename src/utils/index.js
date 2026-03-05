import { FASE_PREFIX } from "../constants";

export function buildLottoId(raw) {
  const cleaned = String(raw || "").trim();
  const noPrefix = cleaned.replace(/^GD-?/i, "").replace(/^-/, "");
  return `GD-${noPrefix}`;
}

export function buildFaseNome(faseType, suffix) {
  return `${FASE_PREFIX[faseType] || ""}${String(suffix || "").trim()}`;
}

export function formatISOWithLocalOffset(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const offAbs = Math.abs(off);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
         `${sign}${pad(Math.floor(offAbs/60))}:${pad(offAbs%60)}`;
}

export function extractApiError(e) {
  if (e?.response?.status === 401) return "401: Credenziali non valide";
  if (e?.response?.status === 404) return "Non trovato (404)";
  if (e?.response?.data?.message) return String(e.response.data.message);
  return e?.message || "Errore di rete o server";
}