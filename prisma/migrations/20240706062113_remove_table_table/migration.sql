/*
  Warnings:

  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_pubId_fkey";

-- DropTable
DROP TABLE "Table";
