export type File = {
  id: number;
  name: string;
  originalName: string;
  size: number;
  userId: number;
  createdAt: string;
  signedUrl?: string;
};

export type Folder = {
  id: number;
  name: string;
  userId: number;
  files: File[] | [];
  createdAt: string;
};

export type User = {
  id: number;
  username: string;
};
