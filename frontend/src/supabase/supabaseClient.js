import { createClient } from "@supabase/supabase-js";
const supabaseUrl = 'https://dommynyziuupuytcqppd.supabase.co';
const supabaseAnonKey = 'sb_publishable_46w0WKXOMtj3c-1J8oFUeA_rOIzKals';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);