import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount) {
  return `${amount.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, ".")} FCFA`;
}
