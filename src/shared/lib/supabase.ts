import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

const hasSafeConfiguration = Boolean(
  supabaseUrl?.startsWith('https://') &&
  supabasePublishableKey &&
  !supabasePublishableKey.startsWith('sb_secret_'),
)

export const supabase =
  hasSafeConfiguration && supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null

export const isSupabaseConfigured = supabase !== null
