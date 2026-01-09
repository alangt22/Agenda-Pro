/*
  Warnings:

  - Added the required column `name_professional` to the `Appoitments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appoitments" ADD COLUMN     "name_professional" TEXT NOT NULL;
