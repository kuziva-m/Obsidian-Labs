import { createClient } from "@supabase/supabase-js";

// 1. Load keys from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Safety check
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase Environment Variables! Check your .env file.",
  );
}

// 3. Create and EXPORT the client
// The "export const" part is what fixes your error
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
