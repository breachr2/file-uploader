import { API_URL } from "@/lib/constants";
import { File as FileType } from "@/lib/types";

const getFiles = async (
  searchParams?: URLSearchParams
): Promise<FileType[]> => {
  const response = await fetch(`${API_URL}/files?${searchParams?.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.error || "An error has occured.");
  }

  return response.json();
};

const createFile = async ({
  file,
  folderId,
}: {
  file: File;
  folderId: string | undefined;
}): Promise<File> => {
  const formData = new FormData();
  formData.append("file", file);

  if (folderId) {
    formData.append("folderId", folderId);
  }
  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.error || "Error creating file");
  }

  return response.json();
};

const deleteFile = async (fileId: number) => {
  const response = await fetch(`${API_URL}/files/${fileId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.error || "Error occured deleting folder");
  }
  return response.json();
};

export { getFiles, createFile, deleteFile };
