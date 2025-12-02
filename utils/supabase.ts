import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://utbxdhpvvceqtmhugzya.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0YnhkaHB2dmNlcXRtaHVnenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzIwMDgsImV4cCI6MjA4MDI0ODAwOH0.TGa0ii-Zj-v_SYIJsaz9g5t-Q7YDoRUOxM6QEVWg6HQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
