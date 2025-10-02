import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test the connection
supabase.from('bookings').select('count', { count: 'exact', head: true })
  .then(() => console.log('Successfully connected to Supabase'))
  .catch(error => console.error('Failed to connect to Supabase:', error.message));