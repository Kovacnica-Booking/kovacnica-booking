/*
  # Create Bookings Table for Room Booking System

  ## Overview
  This migration creates the core bookings table for a room booking calendar application.
  The system allows users to book meeting rooms with time slots and manage their bookings using PIN codes.

  ## Tables Created
  
  ### `bookings` table
  - `id` (uuid, primary key): Unique identifier for each booking, auto-generated
  - `room` (text, required): Name of the room being booked (e.g., "Sejna 1", "Sejna 2")
  - `start_time` (timestamptz, required): When the booking starts
  - `end_time` (timestamptz, required): When the booking ends
  - `title` (text, required): Description or title of the booking
  - `pin` (text, required): 4-digit PIN code used to manage/delete the booking
  - `created_at` (timestamptz): Timestamp when the booking was created, defaults to now()

  ## Security (Row Level Security)
  
  ### RLS Status
  - RLS is **enabled** on the bookings table to control access
  
  ### Access Policies
  
  1. **Public Read Access**
     - Anyone can view all bookings (needed for the calendar display)
     - Policy: "Anyone can view bookings"
  
  2. **Public Insert Access**
     - Anyone can create new bookings (public booking system)
     - Policy: "Anyone can create bookings"
  
  3. **PIN-Based Delete Access**
     - Users can only delete bookings if they provide the correct PIN
     - This is enforced at the application level (PIN verification before delete)
     - Policy: "Anyone can delete bookings" (application enforces PIN check)
  
  ## Important Notes
  - This is a public booking system where anyone can view and create bookings
  - Bookings are protected by PIN codes for deletion/modification
  - The PIN verification is handled in the application layer
  - Timestamps are stored in UTC with timezone support (timestamptz)
*/

-- Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  title text NOT NULL,
  pin text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to view all bookings (needed for calendar display)
CREATE POLICY "Anyone can view bookings"
  ON bookings
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to create new bookings
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to delete bookings
-- Note: PIN verification is enforced at the application level
CREATE POLICY "Anyone can delete bookings"
  ON bookings
  FOR DELETE
  USING (true);

-- Create an index on start_time for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);

-- Create an index on room for faster filtering by room
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room);