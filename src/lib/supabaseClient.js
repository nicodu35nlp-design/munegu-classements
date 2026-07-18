import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config";

// null si les variables d'environnement ne sont pas encore configurées —
// permet à l'app de tourner (avec un message d'aide) avant que Supabase soit branché.
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
