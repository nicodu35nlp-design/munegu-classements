import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAuth() {
  const [session, setSession] = useState(undefined); // undefined = pas encore chargé
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn(email, password) {
    if (!supabase) {
      setError("Supabase n'est pas configuré (voir README).");
      return false;
    }
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      return false;
    }
    return true;
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return {
    session,
    user: session?.user ?? null,
    loading: session === undefined,
    error,
    signIn,
    signOut,
    configured: Boolean(supabase),
  };
}
