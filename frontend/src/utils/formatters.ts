/**
 * Currency, Percentage, and Number Formatters
 * Strict adherence to Indian numbering formatting: ₹60,000, ₹5,00,000, etc.
 */

export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

export function formatINRShort(amount: number | null | undefined): string {
  if (!amount || isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount}`;
}

export function formatPercent(rate: number | null | undefined): string {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return '0%';
  }
  return `${rate.toFixed(2)}%`;
}

export function formatMonths(months: number): string {
  if (!months) return '0 mos';
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years > 0 && remMonths === 0) {
    return `${years} ${years === 1 ? 'Year' : 'Years'} (${months} mos)`;
  }
  return `${months} Months`;
}
