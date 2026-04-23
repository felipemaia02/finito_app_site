/**
 * Formats an amount in cents to a Brazilian Real currency string.
 * Example: 2500 → "R$ 25,00"
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

/**
 * Converts a decimal value (e.g. 25.50) to cents (2550).
 */
export function toCents(value: number): number {
  return Math.round(value * 100);
}

/**
 * Converts cents to a decimal value.
 */
export function fromCents(cents: number): number {
  return cents / 100;
}
