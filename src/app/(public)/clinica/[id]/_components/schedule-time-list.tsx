'use client';

import { TimeSlot } from '@/app/(public)/clinica/[id]/_components/schedule-content';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  isSlotInThePast,
  isSlotSequenceAvailable,
  isToday,
} from '@/app/(public)/clinica/[id]/_components/schedule-utils';

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredTimeSlots: number;
  blockedTimes: string[];
  availableTimeSlots: TimeSlot[];
  clinicTimes: string[];
  onSelectTime: (time: string) => void;
}

export default function ScheduleTimeList({
  selectedDate,
  selectedTime,
  requiredTimeSlots,
  blockedTimes,
  availableTimeSlots,
  clinicTimes,
  onSelectTime,
}: ScheduleTimeListProps) {
  const dateIsToday = isToday(selectedDate);

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {availableTimeSlots.map(slot => {
        const sequenceOk = isSlotSequenceAvailable(
          slot.time,
          requiredTimeSlots,
          clinicTimes,
          blockedTimes
        );

        const slotIsPast = dateIsToday && isSlotInThePast(slot.time);
        const slotEnable = slot.isAvailable && sequenceOk && !slotIsPast;

        return (
          <Button
            onClick={() => slotEnable && onSelectTime(slot.time)}
            type="button"
            variant="outline"
            key={slot.time}
            className={cn(
              'h-10 select-none',
              selectedTime === slot.time &&
                'border-emerald-500 text-primary border-2'
            )}
            disabled={!slotEnable}
          >
            {slot.time}
          </Button>
        );
      })}
    </div>
  );
}
