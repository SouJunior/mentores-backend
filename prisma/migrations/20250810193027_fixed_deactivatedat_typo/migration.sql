/*
  Warnings:

  - You are about to drop the column `desctivedAt` on the `mentors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mentors" DROP COLUMN "desctivedAt",
ADD COLUMN     "deactivatedAt" TIMESTAMP(3);
