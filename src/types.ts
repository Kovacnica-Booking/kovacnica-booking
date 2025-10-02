export interface Booking {
  id: string;
  room: string;
  start_time: string;
  end_time: string;
  title: string;
  pin: string;
  created_at: string;
}

export type Room = 'Sejna 1' | 'Sejna 2';

export interface TimeRange {
  start: Date;
  end: Date;
}