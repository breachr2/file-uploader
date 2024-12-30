import { Folder } from "@/lib/types";
import { API_URL } from "@/lib/constants";

const getPublicFolder = async (
  folderId: string | undefined
): Promise<Folder[]> => {
  const response = await fetch(`${API_URL}/public-folders/${folderId}`);

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error);
  }

  return response.json();
};

export { getPublicFolder };
