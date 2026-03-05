import { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import PreseminaPage from "./pages/PreseminaPage";
import RaccoltaPage from "./pages/RaccoltaPage";
import StoccaggioPage from "./pages/StoccaggioPage";

function Router() {
  const { isAuthed } = useAuth();
  const [page, setPage] = useState("landing");

  if (!isAuthed) return <LoginPage />;

  return (
    <>
      {page === "landing"    && <LandingPage onGo={setPage} />}
      {page === "presemina"  && <PreseminaPage  onBack={() => setPage("landing")} />}
      {page === "raccolta"   && <RaccoltaPage   onBack={() => setPage("landing")} />}
      {page === "stoccaggio" && <StoccaggioPage onBack={() => setPage("landing")} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}