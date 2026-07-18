import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginGate from "./pages/LoginGate";
import PlayerView from "./pages/PlayerView";
import BackstageView from "./pages/BackstageView";
import BackstageGate from "./components/BackstageGate";

function Home() {
  // Pas de persistance : la page de connexion s'affiche à chaque ouverture
  // de l'app, le pseudo n'est conservé qu'en mémoire le temps de la session.
  const [pseudo, setPseudo] = useState("");

  if (!pseudo) {
    return <LoginGate onLogin={setPseudo} />;
  }
  return <PlayerView pseudo={pseudo} onChangePseudo={() => setPseudo("")} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/backstage"
          element={
            <BackstageGate>
              {({ user, signOut }) => <BackstageView user={user} signOut={signOut} />}
            </BackstageGate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
