'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome do serviço é obrigatório' }),
  price: z.string().min(1, { message: 'O preço do serviço é obrigatório' }),
  hours: z.string(),
  minutes: z.string(),
});

export interface UseDialogServiceProps {
  initialValues?: {
    name: string;
    price: string;
    hours: string;
    minutes: string;
  };
}

export type DialogServiceFormData = z.infer<typeof formSchema>;

export function useDialogServiceForm({ initialValues }: UseDialogServiceProps) {
  return useForm<DialogServiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: '',
      price: '',
      hours: '',
      minutes: '',
    },
  });
}
