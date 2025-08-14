// blog-frontend/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL; // Add your Supabase URL here
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Add your Supabase anon key here

export const supabase = createClient(supabaseUrl, supabaseKey);
