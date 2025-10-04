// Domain utility for phone number formatting and normalization
// Keep domain independent and reusable across layers

/**
 * Normalize phone number by removing all non-digit characters
 */
export function normalizePhone(input: string | null | undefined): string {
  if (!input) return "";
  return input.replace(/\D/g, "");
}

/**
 * Format phone number for human readability
 * - 10 digits: xxx-xxx-xxxx (e.g., 081-234-5678)
 * - 9 digits: xxx-xxx-xxx
 * - otherwise: returns original input
 */
export function getFormatPhone(input: string | null | undefined): string {
  if (!input) return "";
  const digits = normalizePhone(input);

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 9) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Fallback: return original string
  return input;
}
