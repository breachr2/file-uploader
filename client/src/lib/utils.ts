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
    formattedFileSize = `${(fileSize / 1024).toFixed(1)} kB`;
  } else {
    formattedFileSize = `${(fileSize / 1024 ** 2).toFixed(1)} mB`;
  }

  return formattedFileSize;
}

// Makes artifical delays
export function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function getBasePath(pathname: string) {
  const isFoldersPath = pathname.startsWith("/folders");
  const isSharePath = pathname.startsWith("/share");
  let basePath = "";
  if (isFoldersPath) {
    basePath = "/folders";
  } else if (isSharePath) {
    const folderSlug = pathname.split("/")[2];
    basePath = `/share/${folderSlug}`;
  }
  return basePath;
}
