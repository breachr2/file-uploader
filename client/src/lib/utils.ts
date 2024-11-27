import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  const newDate = new Date(date);
  const monthName = newDate.toLocaleString("default", { month: "long" });

  // Returns month, day, year
  return `${monthName} ${newDate.getDate()}, ${newDate.getFullYear()}`;
}

export function formatFileSize(fileSize : number) {
  if (fileSize) {

  } else if (fileSize) {
    
  }
}