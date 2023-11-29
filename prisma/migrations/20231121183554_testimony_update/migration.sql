/*
  Warnings:

  - Added the required column `role` to the `testimony` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "testimony" ADD COLUMN     "role" TEXT NOT NULL;
