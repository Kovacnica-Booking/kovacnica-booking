/*
  # Fix Security Issues

  ## Overview
  This migration fixes two security issues identified in the database:
  1. Removes the unused index `idx_bookings_room` on the bookings table
  2. Fixes the function search path vulnerability in `cleanup_past_bookings` function

  ## Changes Made

  ### 1. Remove Unused Index
  - Drops `idx_bookings_room` index which was not being used by queries
  - The `idx_bookings_start_time` index is sufficient for the current query patterns

  ### 2. Fix Function Search Path
  - Updates the `cleanup_past_bookings` function to use a secure search path
  - Sets `search_path` to an empty string to prevent search path manipulation attacks
  - Qualifies table references with schema name (public.bookings)
  - Maintains SECURITY DEFINER for proper execution context
  
  ## Security Impact
  - Reduces attack surface by removing unused database objects
  - Prevents potential SQL injection via search_path manipulation
  - Ensures function always references the correct schema objects
*/

-- Drop the unused index on room column
DROP INDEX IF EXISTS idx_bookings_room;

-- Recreate the cleanup function with secure search path
CREATE OR REPLACE FUNCTION public.cleanup_past_bookings()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete bookings where end_time is in the past
  DELETE FROM public.bookings
  WHERE end_time < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup action
  RAISE NOTICE 'Deleted % past bookings at %', deleted_count, NOW();
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = '';