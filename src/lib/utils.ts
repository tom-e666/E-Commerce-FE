import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Vietnamese currency (VND)
 * @param amount - The amount to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number, 
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
    ...options,
  }).format(amount)
}