import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginGate, { getActivePseudo } from "./pages/LoginGate";
import PlayerView from "./pages/PlayerView";
import BackstageView from "./pages/BackstageView";
import BackstageGate from "./components/BackstageGate";

function Home() {
  const [pseudo, setPseudo] = useState(getActivePseudo());

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
