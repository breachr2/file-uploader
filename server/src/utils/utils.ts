import crypto from "crypto";

export type FileQueryParams = {
  name?: "asc" | "desc";
  size?: "asc" | "desc";
  createdAt?: "asc" | "desc";
};

export function getOrderBy({ name, size, createdAt }: FileQueryParams) {
  const orderBy: FileQueryParams = {};

  if (createdAt && (createdAt === "asc" || createdAt === "desc")) {
    orderBy.createdAt = createdAt;
  }

  if (name && (name === "asc" || name === "desc")) {
    orderBy.name = name;
  }

  if (size && (size === "asc" || size === "desc")) {
    orderBy.size = size;
  }

  return orderBy;
}

export function isExpired(expiresDate: Date) {
  if (expiresDate < new Date()) {
    return true;
  }

  return false;
}

export function generateExpiresDate(expiresValue: number) {
  return new Date(Date.now() + expiresValue);
}

export const generateRandomName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};
