import { Folder } from "@/lib/types";
import { API_URL } from "@/lib/constants";

const getPublicFolder = async (
  folderSlug: string | undefined,
  searchParams?: URLSearchParams
): Promise<Folder[]> => {
  const response = await fetch(
    `${API_URL}/public-folders/${folderSlug}?${searchParams?.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error || "An error has occured");
  }

  return response.json();
};

export { getPublicFolder };
