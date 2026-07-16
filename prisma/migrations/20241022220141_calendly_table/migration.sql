/*
  Warnings:

  - You are about to drop the column `accessTokenExpiration` on the `mentors` table. All the data in the column will be lost.
  - You are about to drop the column `agendaName` on the `mentors` table. All the data in the column will be lost.
  - You are about to drop the column `calendlyAccessToken` on the `mentors` table. All the data in the column will be lost.
  - You are about to drop the column `calendlyName` on the `mentors` table. All the data in the column will be lost.
  - You are about to drop the column `calendlyRefreshToken` on the `mentors` table. All the data in the column will be lost.
  - You are about to drop the column `calendlyUserUuid` on the `mentors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mentors" DROP COLUMN "accessTokenExpiration",
DROP COLUMN "agendaName",
DROP COLUMN "calendlyAccessToken",
DROP COLUMN "calendlyName",
DROP COLUMN "calendlyRefreshToken",
DROP COLUMN "calendlyUserUuid";

-- CreateTable
CREATE TABLE "calendlyInfo" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "calendlyUserUuid" TEXT,
    "calendlyRefreshToken" TEXT,
    "calendlyAccessToken" TEXT,
    "accessTokenExpiration" TIMESTAMP(3),
    "calendlyName" TEXT,
    "agendaName" TEXT,

    CONSTRAINT "calendlyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calendlyInfo_mentorId_key" ON "calendlyInfo"("mentorId");

-- AddForeignKey
ALTER TABLE "calendlyInfo" ADD CONSTRAINT "calendlyInfo_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
