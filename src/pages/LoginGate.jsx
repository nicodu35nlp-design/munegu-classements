import { useState } from "react";
import crest from "../assets/monaco-crest.png";

const PSEUDO_KEY = "munegu_active_pseudo";

export function getActivePseudo() {
  return localStorage.getItem(PSEUDO_KEY) || "";
}

export function clearActivePseudo() {
  localStorage.removeItem(PSEUDO_KEY);
}

export default function LoginGate({ onLogin }) {
  const [input, setInput] = useState("");

  function submit(e) {
    e.preventDefault();
    const pseudo = input.trim();
    if (!pseudo) return;
    localStorage.setItem(PSEUDO_KEY, pseudo);
    onLogin(pseudo);
  }

  return (
    <div className="login-gate">
      <div className="login-card">
        {/* Le logo dédié Munegu Quiz remplacera ce texte dès qu'il sera prêt */}
        <img src={crest} alt="AS Monaco" className="login-crest" />
        <h1 className="login-title">Munegu Quiz</h1>
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
