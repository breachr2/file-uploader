/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileUrl",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "signedUrl" TEXT;
