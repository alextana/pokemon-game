/*
  Warnings:

  - A unique constraint covering the columns `[chosenName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chosenName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_chosenName_key" ON "User"("chosenName");
