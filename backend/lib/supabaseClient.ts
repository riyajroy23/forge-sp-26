import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.SUPABASE_URL!
const supabaseKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)