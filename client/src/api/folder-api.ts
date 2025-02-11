import { API_URL } from "@/lib/constants";
import { Folder } from "@/lib/types";

const getFolder = async (
  folderId: string | undefined,
  searchParams?: URLSearchParams | undefined
): Promise<Folder> => {
  const response = await fetch(
    `${API_URL}/folders/${folderId}?${searchParams?.toString()}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(
      errorResponse?.error || "An error has occurred while getting this folder."
    );
  }

  return response.json();
};

const getFolders = async (): Promise<Folder[]> => {
  const response = await fetch(`${API_URL}/folders`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.error);
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
    const errorResponse = await response.json();
    throw new Error(
      errorResponse?.error || "An error has occurred while creating the folder."
    );
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
    const errorResponse = await response.json();
    throw new Error(
      errorResponse?.error || "An error has occurred while updating the folder."
    );
  }

  return response.json();
};

const deleteFolder = async (folderId: string) => {
  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(
      errorResponse?.error || "An error has occurred while deleting the folder."
    );
  }
  return response.json();
};

const makeFolderPublic = async ({
  folderId,
  expiresValue,
}: {
  folderId: string;
  expiresValue: string | undefined;
}) => {
  const response = await fetch(`${API_URL}/folders/${folderId}/make-public`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ expiresValue }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse || "An error has occured creating a folder");
  }

  return response.json();
};

export {
  getFolder,
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  makeFolderPublic,
};
