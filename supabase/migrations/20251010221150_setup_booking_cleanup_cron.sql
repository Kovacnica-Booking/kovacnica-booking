/*
  # Setup Automatic Booking Cleanup - Cron Job

  1. Purpose
    - Automatically delete past bookings every Sunday at 23:59
    - Keeps the database clean by removing expired bookings
    - Only deletes bookings where end_time is in the past

  2. Implementation
    - Creates a SQL function to delete past bookings
    - Schedules it with pg_cron to run every Sunday at 23:59
    - Cron expression: 59 23 * * 0 (Sunday at 11:59 PM)

  3. Safety
    - Only deletes bookings with end_time < NOW()
    - No risk of deleting future bookings
    - Returns count of deleted records for logging
*/

-- Create function to clean up past bookings
CREATE OR REPLACE FUNCTION cleanup_past_bookings()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete bookings where end_time is in the past
  DELETE FROM bookings
  WHERE end_time < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup action
  RAISE NOTICE 'Deleted % past bookings at %', deleted_count, NOW();
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the cleanup job to run every Sunday at 23:59
SELECT cron.schedule(
  'cleanup-past-bookings-weekly',
  '59 23 * * 0',
  'SELECT cleanup_past_bookings();'
);
