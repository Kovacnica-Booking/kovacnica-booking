import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

Deno.serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    console.log(`Running cleanup at ${now.toISOString()}`);

    const { data, error, count } = await supabase
      .from('bookings')
      .delete({ count: 'exact' })
      .lt('end_time', now.toISOString());

    if (error) {
      console.error('Error deleting past bookings:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Successfully deleted ${count} past bookings`);

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount: count,
        timestamp: now.toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
