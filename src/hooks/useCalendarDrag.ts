import { useState, useRef, useEffect } from 'react';
import { isSameDay, setHours, setMinutes, addMinutes, format } from 'date-fns';
import type { TimeRange } from '@/types';

export interface DragState {
  day: Date;
  time: Date;
}

interface Position {
  top: number;
  left: number;
  right: number;
  width: number;
}

export function useCalendarDrag(
  isTimeSlotAvailable: (start: Date, end: Date) => boolean,
  onTimeRangeSelect: (range: TimeRange, position: Position) => void,
  isMobile: boolean = false
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const [dragEnd, setDragEnd] = useState<DragState | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [isValidTimeSlot, setIsValidTimeSlot] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellHeight = isMobile ? 64 : 48;

  useEffect(() => {
    const handleGlobalEnd = () => {
      if (dragStart && isValidTimeSlot && !isMobile) {
        if (!hasMoved) {
          // Single click - create 1-hour slot
          const endTime = addMinutes(dragStart.time, 60);
          if (isTimeSlotAvailable(dragStart.time, endTime)) {
            const columnEl = gridRef.current?.querySelector(`[data-day="${format(dragStart.day, 'yyyy-MM-dd')}"]`);
            if (columnEl) {
              const rect = columnEl.getBoundingClientRect();
              const startHour = dragStart.time.getHours();
              const startMinute = dragStart.time.getMinutes();
              const top = rect.top + (startHour - 7) * cellHeight + startMinute * (cellHeight / 60);

              onTimeRangeSelect(
                { start: dragStart.time, end: endTime },
                { top, left: rect.left, right: rect.right, width: rect.width }
              );
            }
          }
        } else if (dragEnd) {
          // Drag ended - use selected range
          const startTime = dragStart.time < dragEnd.time ? dragStart.time : dragEnd.time;
          const endTime = dragStart.time < dragEnd.time ? dragEnd.time : dragStart.time;
          
          if (isTimeSlotAvailable(startTime, endTime)) {
            const columnEl = gridRef.current?.querySelector(`[data-day="${format(dragStart.day, 'yyyy-MM-dd')}"]`);
            if (columnEl) {
              const rect = columnEl.getBoundingClientRect();
              const startHour = startTime.getHours();
              const startMinute = startTime.getMinutes();
              const top = rect.top + (startHour - 7) * cellHeight + startMinute * (cellHeight / 60);
              
              onTimeRangeSelect(
                { start: startTime, end: endTime },
                { top, left: rect.left, right: rect.right, width: rect.width }
              );
            }
          }
        }
      }

      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
      setHasMoved(false);
      setIsValidTimeSlot(true);
      document.body.classList.remove('no-select');
    };

    window.addEventListener('mouseup', handleGlobalEnd);
    if (!isMobile) {
      window.addEventListener('touchend', handleGlobalEnd);
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      if (!isMobile) {
        window.removeEventListener('touchend', handleGlobalEnd);
      }
    };
  }, [isDragging, dragStart, dragEnd, hasMoved, onTimeRangeSelect, isTimeSlotAvailable, isValidTimeSlot, isMobile, cellHeight]);

  const handleDragStart = (day: Date, hour: number, isFirstHalf: boolean) => {
    const time = setMinutes(setHours(day, hour), isFirstHalf ? 0 : 30);

    if (!isTimeSlotAvailable(time, addMinutes(time, 30))) {
      setIsValidTimeSlot(false);
      return;
    }

    if (isMobile) {
      const endTime = addMinutes(time, 60);
      if (isTimeSlotAvailable(time, endTime)) {
        const columnEl = gridRef.current?.querySelector(`[data-day="${format(day, 'yyyy-MM-dd')}"]`);
        if (columnEl) {
          const rect = columnEl.getBoundingClientRect();
          const startHour = time.getHours();
          const startMinute = time.getMinutes();
          const top = rect.top + (startHour - 7) * cellHeight + startMinute * (cellHeight / 60);

          onTimeRangeSelect(
            { start: time, end: endTime },
            { top, left: rect.left, right: rect.right, width: rect.width }
          );
        }
      }
      return;
    }

    setDragStart({ day, time });
    setDragEnd({ day, time });
    setIsDragging(true);
    setHasMoved(false);
    setIsValidTimeSlot(true);
    document.body.classList.add('no-select');
  };

  const handleDragMove = (day: Date, clientY: number) => {
    if (isMobile || !dragStart || !isSameDay(dragStart.day, day)) return;

    const columnEl = gridRef.current?.querySelector(`[data-day="${format(day, 'yyyy-MM-dd')}"]`);
    if (columnEl) {
      const rect = columnEl.getBoundingClientRect();
      const y = clientY - rect.top;
      const hour = Math.floor(y / cellHeight) + 7;
      const minute = Math.floor((y % cellHeight) / (cellHeight / 2)) * 30;
      
      if (hour >= 7 && hour <= 20) {
        const newEndTime = setMinutes(setHours(day, hour), minute);
        
        if (Math.abs(newEndTime.getTime() - dragStart.time.getTime()) > 0) {
          setHasMoved(true);
          
          const startTime = dragStart.time < newEndTime ? dragStart.time : newEndTime;
          const endTime = dragStart.time < newEndTime ? newEndTime : dragStart.time;
          
          setIsValidTimeSlot(isTimeSlotAvailable(startTime, endTime));
          setDragEnd({ day, time: newEndTime });
        }
      }
    }
  };

  const isInDragRange = (day: Date, hour: number, isFirstHalf: boolean) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    
    if (!isSameDay(dragStart.day, day)) return false;
    
    const time = setMinutes(setHours(day, hour), isFirstHalf ? 0 : 30);
    const start = dragStart.time < dragEnd.time ? dragStart.time : dragEnd.time;
    const end = dragStart.time < dragEnd.time ? dragEnd.time : dragStart.time;
    
    return time >= start && time <= end;
  };

  return {
    gridRef,
    isDragging,
    dragStart,
    dragEnd,
    handleDragStart,
    handleDragMove,
    isInDragRange,
    hasMoved,
    isValidTimeSlot
  };
}