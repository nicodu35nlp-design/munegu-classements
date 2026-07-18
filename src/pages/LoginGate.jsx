import { useState } from "react";
import crest from "../assets/monaco-crest.png";
import summerGamesLogo from "../assets/summer-games-logo.png";

export default function LoginGate({ onLogin }) {
  const [input, setInput] = useState("");

  function submit(e) {
    e.preventDefault();
    const pseudo = input.trim();
    if (!pseudo) return;
    onLogin(pseudo);
  }

  return (
    <div className="login-gate">
      <div className="login-card">
        {/* Le logo dédié Munegu Quiz remplacera ce texte dès qu'il sera prêt */}
        <img src={crest} alt="AS Monaco" className="login-crest" />
        <h1 className="login-title">Munegu Quiz</h1>
        <img src={summerGamesLogo} alt="Summer Games" className="login-sg-logo" />
        <p className="login-sub">Entre ton pseudo pour découvrir tes classements</p>
        <form className="login-form" onSubmit={submit}>
          <input
            type="text"
            placeholder="Ton pseudo Fastory"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit">Voir mes classements</button>
        </form>
      </div>
    </div>
  );
}
