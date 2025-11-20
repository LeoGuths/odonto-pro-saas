import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value);
}

export function formatPhone(value: string) {
  const cleanedValue = value.replace(/\D/g, '');

  if (cleanedValue.length > 11) {
    return value.slice(0, 15);
  }

  return cleanedValue
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
}

export function extractPhoneNumber(phone: string) {
  return phone.replace(/[()\s-]/g, '');
}

/**
 * Converte um valor monetário em reais (BRL) para centavos.
 * @param {string} amount - O valor monetário em reais (BRL) a ser convertido.
 * @return {number} O valor convertido em centavos.
 *
 * @example
 * convertRealToCents("5,00"); // Retorna: 500
 */
export function convertRealToCents(amount: string): number {
  const numericPrice = parseFloat(amount.replace(/\./g, '').replace(',', '.'));

  return Math.round(numericPrice * 100);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
