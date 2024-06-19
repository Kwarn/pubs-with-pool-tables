/*
  Warnings:

  - You are about to drop the column `availablity` on the `Pub` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pub" DROP COLUMN "availablity",
ADD COLUMN     "availability" INTEGER;
