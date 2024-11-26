export type File = {
  id: number;
  name: string;
  size: number;
  userId: number;
  imageUrl?: string;
  createdAt: string;
};

export type Folder = {
  id: number;
  name: string;
  userId: number;
  files?: File[];
};

export type User = {
  id: number;
  username: string;
};
