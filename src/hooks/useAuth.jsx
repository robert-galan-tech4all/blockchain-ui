import { createContext, useContext, useState } from "react";
import { LS_USER, LS_PASS } from "../constants";
import { apiLogin } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
//   const [user, setUser] = useState(localStorage.getItem(LS_USER) || ""); // DA ELIMINARE
//   const [pass, setPass] = useState(localStorage.getItem(LS_PASS) || ""); // DA ELIMINARE
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    setError("");
    try {
      await apiLogin(user, pass);
    //   localStorage.setItem(LS_USER, user.trim()); // DA ELIMINARE
    //   localStorage.setItem(LS_PASS, pass);         // DA ELIMINARE
      setIsAuthed(true);
    } catch {
      setError("Credenziali non valide o errore di rete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, pass, setUser, setPass, isAuthed, loading, error, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}