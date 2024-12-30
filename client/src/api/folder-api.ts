import { API_URL } from "@/lib/constants";
import { Folder } from "@/lib/types";

const getFolder = async (folderId: string | undefined): Promise<Folder> => {
  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error);
  }

  return response.json();
};

const getFolders = async (): Promise<Folder[]> => {
  const response = await fetch(`${API_URL}/folders`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error);
  }

  return response.json();
};

const createFolder = async (folderName: string) => {
  const response = await fetch(`${API_URL}/folders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ folderName }),
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res || "An error has occured creating a folder");
  }

  return response.json();
};

const updateFolder = async ({
  folderId,
  folderName,
}: {
  folderId: string | undefined;
  folderName?: string;
}) => {
  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ folderName }),
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res || "An error has occured creating a folder");
  }

  return response.json();
};

const deleteFolder = async (folderId: number) => {
  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res || "Error occured deleting folder");
  }
  return response.json();
};

export { getFolder, getFolders, createFolder, updateFolder, deleteFolder };
