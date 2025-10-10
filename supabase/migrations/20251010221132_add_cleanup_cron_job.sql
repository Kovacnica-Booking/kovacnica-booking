/*
  # Add Cron Job for Automatic Booking Cleanup

  1. Purpose
    - Automatically delete past bookings every Sunday at 23:59
    - Keeps the database clean by removing old bookings
    - Only deletes bookings where end_time is in the past

  2. Changes
    - Enable pg_cron extension if not already enabled
    - Create a cron job that runs every Sunday at 23:59 (59 23 * * 0)
    - The job invokes the cleanup-past-bookings edge function via HTTP

  3. Security
    - Uses service role key for authentication
    - Only deletes bookings with end_time < current time
    - No risk of deleting future bookings

  4. Notes
    - Cron expression: 59 23 * * 0 means:
      * Minute: 59
      * Hour: 23 (11 PM)
      * Day of month: * (any)
      * Month: * (any)
      * Day of week: 0 (Sunday)
*/

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup job to run every Sunday at 23:59
SELECT cron.schedule(
  'cleanup-past-bookings',
  '59 23 * * 0',
  $$
  SELECT
    net.http_post(
      url:=current_setting('app.supabase_url') || '/functions/v1/cleanup-past-bookings',
      headers:=jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      )
    ) AS request_id;
  $$
);
