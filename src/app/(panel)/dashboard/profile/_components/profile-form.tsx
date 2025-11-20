'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface UseProfileFormProps {
  name: string | null;
  address: string | null;
  phone: string | null;
  status: boolean | null;
  timezone: string | null;
}

const profileSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(1, { message: 'O fuso horário é obrigatório' }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({
  name,
  address,
  phone,
  status,
  timezone,
}: UseProfileFormProps) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name || '',
      address: address || '',
      phone: phone || '',
      status: status ? 'active' : 'inactive',
      timeZone: timezone || '',
    },
  });
}
