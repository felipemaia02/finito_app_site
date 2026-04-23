import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function toISODateTime(date: Date): string {
  return date.toISOString();
}

export function isTokenExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return true;
  try {
    const expiry = parseISO(expiresAt);
    return new Date() >= expiry;
  } catch {
    return true;
  }
}
