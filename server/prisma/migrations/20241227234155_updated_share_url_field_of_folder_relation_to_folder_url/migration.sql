/*
  Warnings:

  - You are about to drop the column `shareUrl` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "shareUrl",
ADD COLUMN     "folderUrl" TEXT;
