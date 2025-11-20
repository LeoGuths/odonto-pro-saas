'use server';

import { signIn } from '@/lib/auth';

type LoginProvider = 'github' | 'google';

export async function handleRegister(provider: LoginProvider) {
  await signIn(provider, { redirectTo: '/dashboard' });
}
