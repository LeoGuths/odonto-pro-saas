'use client';

import { ptBR } from 'date-fns/locale/pt-BR';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface DateTimePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
}

export function DateTimePicker({
  label,
  value,
  onChange,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {value ? value.toLocaleDateString('pt-BR') : 'Selecione a data'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown-months"
            locale={ptBR}
            onSelect={selectedDate => {
              if (selectedDate) {
                onChange(selectedDate);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
