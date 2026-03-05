import axios from "axios";
import { API_BASE, TEST_ENDPOINT } from "../constants";

function cfg(user, pass) {
  return {
    auth: { username: user.trim(), password: pass },
    headers: { "Content-Type": "application/json" },
  };
}

export const apiLogin = (u, p) =>
  axios.get(`${API_BASE}${TEST_ENDPOINT}`, cfg(u, p)).then((r) => {
    if (r?.data?.status && r.data.status !== "OK") throw new Error(r.data.message);
    return r.data;
  });

export const apiGetLotto = (u, p, id) =>
  axios.get(`${API_BASE}/lotti/${encodeURIComponent(id)}`, cfg(u, p)).then((r) => r.data);
export const apiGetLotti = (u, p) =>
  axios.get(`${API_BASE}/lotti`, cfg(u, p)).then((r) => r.data);

export const apiCreateLotto = (u, p, payload) =>
  axios.post(`${API_BASE}/lotti`, payload, cfg(u, p)).then((r) => r.data);

export const apiUpdateLotto = (u, p, id, payload) =>
  axios.put(`${API_BASE}/lotti/${encodeURIComponent(id)}`, payload, cfg(u, p)).then((r) => r.data);

export const apiDeleteLotto = (u, p, id) =>
  axios.delete(`${API_BASE}/lotti/${encodeURIComponent(id)}`, cfg(u, p)).then((r) => r.data);

export const apiGetFase = (u, p, lottoId, faseName) =>
  axios.get(`${API_BASE}/lotti/${encodeURIComponent(lottoId)}/fasi/${encodeURIComponent(faseName)}`, cfg(u, p)).then((r) => r.data);

export const apiCreateFase = (u, p, lottoId, payload) =>
  axios.post(`${API_BASE}/lotti/${encodeURIComponent(lottoId)}/fasi`, payload, cfg(u, p)).then((r) => r.data);

export const apiUpdateFase = (u, p, lottoId, faseName, payload) =>
  axios.put(`${API_BASE}/lotti/${encodeURIComponent(lottoId)}/fasi/${encodeURIComponent(faseName)}`, payload, cfg(u, p)).then((r) => r.data);

export const apiDeleteFase = (u, p, lottoId, faseName) =>
  axios.delete(`${API_BASE}/lotti/${encodeURIComponent(lottoId)}/fasi/${encodeURIComponent(faseName)}`, cfg(u, p)).then((r) => r.data);

// Fetch all fasi for a lotto (used by Trebbiatura dropdown)
export const apiGetLottoFasi = (u, p, lottoId) =>
  axios.get(`${API_BASE}/lotti/${encodeURIComponent(lottoId)}/fasi`, cfg(u, p)).then((r) => r.data);