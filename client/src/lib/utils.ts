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

export function formatFileSize(fileSize: number) {
  let formattedFileSize: string;

  if (fileSize < 1024) {
    formattedFileSize = `${fileSize} bytes`;
  } else if (fileSize < 1024 ** 2) {
    formattedFileSize = `${(fileSize / 1024).toFixed(0)} kB`;
  } else {
    formattedFileSize = `${(fileSize / 1024 ** 2).toFixed(2)} mB`;
  }

  return formattedFileSize
}
