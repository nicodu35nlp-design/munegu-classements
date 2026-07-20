import { useState } from "react";
import LoginGate from "./pages/LoginGate";
import PlayerView from "./pages/PlayerView";
import { useQuizData } from "./hooks/useQuizData";

export default function App() {
  // Un seul appel ici, partagé entre la connexion (validation du pseudo) et
  // la page de classements, pour ne synchroniser les données qu'une fois.
  const { rows, status } = useQuizData();

  // Pas de persistance : la page de connexion s'affiche à chaque ouverture
  // de l'app, le pseudo n'est conservé qu'en mémoire le temps de la session.
  const [pseudo, setPseudo] = useState("");

  if (!pseudo) {
    return <LoginGate rows={rows} onLogin={setPseudo} />;
  }
  return <PlayerView rows={rows} status={status} pseudo={pseudo} onChangePseudo={() => setPseudo("")} />;
}
