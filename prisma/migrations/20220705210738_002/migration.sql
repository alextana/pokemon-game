/*
  Warnings:

  - The primary key for the `Pokemon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Pokemon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("userId");
